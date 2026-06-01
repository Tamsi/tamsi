import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LocaleProvider, useLocale } from './locale-context'
import { dictionaries } from './dictionaries'

function LocaleReader() {
  const { locale, setLocale, t } = useLocale()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="title">{t.meta.title}</span>
      <button onClick={() => setLocale('en')}>to-en</button>
      <button onClick={() => setLocale('fr')}>to-fr</button>
    </div>
  )
}

describe('LocaleProvider', () => {
  it('reads the stored locale from localStorage on mount', () => {
    localStorage.setItem('locale', 'en')
    render(
      <LocaleProvider>
        <LocaleReader />
      </LocaleProvider>,
    )
    expect(screen.getByTestId('locale')).toHaveTextContent('en')
    expect(screen.getByTestId('title')).toHaveTextContent(
      dictionaries.en.meta.title,
    )
  })

  it('setLocale updates the context, localStorage, <html lang> and document.title', () => {
    localStorage.setItem('locale', 'fr')
    render(
      <LocaleProvider>
        <LocaleReader />
      </LocaleProvider>,
    )

    act(() => {
      screen.getByText('to-en').click()
    })

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
    expect(screen.getByTestId('title')).toHaveTextContent(
      dictionaries.en.meta.title,
    )
    expect(localStorage.getItem('locale')).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe(dictionaries.en.meta.title)
  })

  it('rejects useLocale outside the provider', () => {
    function Naked() {
      useLocale()
      return null
    }
    expect(() => render(<Naked />)).toThrow(
      'useLocale must be used within LocaleProvider',
    )
  })
})
