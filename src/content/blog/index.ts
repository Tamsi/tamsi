import { hermesAutomation } from './hermes-automation'
import { aiCodeReviewerMcp } from './ai-code-reviewer-mcp'
import { redbeeMcp } from './redbee-mcp'
import { qwenRemoteInference } from './qwen-remote-inference'
import { unslothStudioHfLive } from './unsloth-studio-hf-live'
import { unslothStudio } from './unsloth-studio'
import { huggimon } from './huggimon'
import type { BlogPost } from './types'

export type { BlogBlock, BlogPost, BlogPostContent } from './types'

export const blogPosts: BlogPost[] = [
  unslothStudio,
  huggimon,
  unslothStudioHfLive,
  hermesAutomation,
  qwenRemoteInference,
  redbeeMcp,
  aiCodeReviewerMcp,
]

export const blogPostsBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>
