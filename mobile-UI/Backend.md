# Trex Web (TMemeRZ) Backend Architecture & Migration Guide

This document contains a comprehensive breakdown of the existing Supabase backend architecture built for the Trex (TMemeRZ) mobile platform. When generating the full-stack code for the Next.js / React web platform, use this master guide to correctly interface with the established backend.

**CRITICAL DIRECTIVE:** The database schema, RPC functions, and storage buckets ALREADY EXIST on Supabase. Your job is ONLY to build the client-side wrappers, hooks, UI components, and API routes that interact with this backend. Do NOT alter the database schema or rewrite SQL policies.

---

## 1. Authentication Configuration

The backend relies on `@supabase/supabase-js` Email/Password Auth.

**Implementation Details:**
- Must instantiate a global Supabase client.
- Create an Auth Context wrapper (`AuthProvider`) that listens to `supabase.auth.onAuthStateChange`.
- Protect all main routes (`/feed`, `/profile`, `/upload`) with middleware or route wrappers depending on the framework (e.g., Next.js App Router).
- Unauthenticated users should be redirected to `/auth/login`.

---

## 2. PostgreSQL Schema Implementation

Adhere STRICTLY to the following TypeScript interfaces and column structures. 

### `profiles` Table
Core user identity and gamification traits.
- `id`: `uuid` (Primary Key, matching `auth.users.id`)
- `email`: `string`
- `username`: `string`
- `avatar_url`: `string | null` (Points to public URL in "avatars" bucket)
- `full_name`: `string | null`
- `bio`: `string | null`
- `website`: `string | null`
- `karma`: `number` (Gamification core metric)
- `streak`: `number` (Gamification core metric, backed by a streak reset cron job)
- `has_seen_tutorial`: `boolean`
- `created_at`: `timestamp`

### `posts` Table
Contains tech memes, image/video URLs, and specific metadata.
- `id`: `uuid` (Primary Key)
- `user_id`: `uuid` (Foreign Key to `profiles.id`)
- `image_url`: `string` (References file in storage bucket)
- `caption`: `string | null`
- `media_type`: `'image' | 'video'`
- `tags`: `string[] | null` (Used by AI auto-tagging system)
- `top_text`: `string | null` (Meme editing)
- `bottom_text`: `string | null`
- `text_overlays`: `json | null`
- `created_at`: `timestamp`

### `likes` & `comments` Tables
- **`likes`:**
  - Composite Key / Tracking: `user_id` (uuid), `post_id` (uuid), `created_at` (timestamp)
- **`comments`:**
  - `id` (uuid), `user_id` (uuid), `post_id` (uuid), `content` (string), `created_at` (timestamp)

### `follows` Table
- `follower_id` (uuid)
- `following_id` (uuid)
- `created_at` (timestamp)

### `notifications` Table
Real-time architecture. Subscribe to this via Supabase Realtime Channels.
- `id` (uuid)
- `user_id` (uuid - target)
- `actor_id` (uuid - trigger)
- `type` (`'like' | 'comment' | 'follow' | 'message' | 'new_post'`)
- `resource_id` (uuid of the relevant entity)
- `read` (boolean)
- `created_at` (timestamp)

### `news_feed` & `user_interests`
- **`news_feed`:** `id`, `category`, `title`, `summary`, `content`, `article_url`, `source`, `timestamp`, `image_url`, `category_color`, `is_trending`, `published_at`
- **`user_interests`:** `user_id`, `interests`, `custom_interests`, `onboarding_completed`

---

## 3. Remote Procedure Calls (RPCs) - Core Logic

Do NOT use standard `.select()` queries for main feeds. The DB contains advanced RPCs designed for algorithmic feed serving:

1. **`get_trending_posts(interval_hours? integer)`**
   - **Usage:** Trending Feed.
   - **Returns:** Posts sorted by popularity, along with `like_count`, `author_username`, `author_avatar_url`.

2. **`get_recommended_posts(target_user_id uuid, result_limit? integer)`**
   - **Usage:** "For You" algorithm.
   - **Returns:** Posts sorted by `recommendation_score` to optimize personalized engagement.

3. **`create_or_get_chat(target_user_id uuid)`**
   - **Usage:** Messaging / Direct Messages.
   - **Returns:** Chat interface ID.

**Note on Frontend Logic:** Wrap these RPC calls in SWR or React Query hooks for performance and cache invalidation. Combine with `IntersectionObserver` to implement infinite scrolling.

---

## 4. Supabase Storage Buckets

File uploads must follow the standard process using existing buckets:
1. **Avatars Bucket:** For user profile pictures.
2. **Posts/Memes Bucket:** For user-uploaded or AI-generated meme images.

**Standard Flow:**
1. Generate UUID filename.
2. Call `supabase.storage.from('bucket-name').upload(path, file)`.
3. Call `getPublicUrl` to retrieve the source URL.
4. Insert URL directly into `posts.image_url` or `profiles.avatar_url`.

---

## 5. Master Prompt & Implementation Rules

When prompting another AI or configuring your development environment to implement the site, provide them the context above alongside the following rules:

**Web UI Implementation Focus:**
- **Gamified Profile:** Read `karma` and `streak` from `profiles`. Render a GitHub-esque contribution graph (from user activity/posts) mapping to their streaks. Breaking a streak should visually feel like failing a CI/CD build.
- **Web Feed UX:** Display items dynamically as Reels/TikToks or high-density grids optimized for mouse scrolling. Optimistically update UI states (e.g., Upvote coloring) before async completion.
- **Realtime WebSockets:** Implement a notification badge in the main Navigation Bar that listens to `@supabase/supabase-js` `channel('notifications').on('postgres_changes', ...)` for the logged-in user.
- **Visual Design:** Strictly dark mode (`#1a1a2e`). Utilize neon/terminal accents (like Green `#00FF00` and Purple `#7C3AED`) to resonate with the "Dev Humor / Break Room" aesthetic.

**Prompt to Generate Boilerplate:**
> "Using Next.js App Router, Tailwind CSS, and @supabase/supabase-js, generate the full directory structure, Auth Provider wrapper, infinite scroll hooks using the predefined `.rpc()` endpoints, and the main `Feed` component. The schema strict types are defined as above, please output fully type-safe code."
