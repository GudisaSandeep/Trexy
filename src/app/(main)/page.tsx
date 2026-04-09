import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PostItem } from '@/components/PostItem'

interface PostPayload {
  id: string
  image_url: string
  caption?: string
  created_at: string
  author_username?: string
  author_avatar_url?: string
  like_count?: number
  comment_count?: number
}

export default async function FeedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let feed: PostPayload[] = []
  let feedError = null

  const { data, error } = await supabase.rpc('get_recommended_posts', { 
    target_user_id: user.id,
    result_limit: 50
  })

  if (error) {
    const fallbackResponse = await supabase
      .from('posts')
      .select(`
        id, 
        image_url, 
        caption, 
        created_at, 
        profiles!posts_user_id_fkey (username, avatar_url),
        likes (count),
        comments (count)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (fallbackResponse.data) {
       feed = fallbackResponse.data.map((p: any) => ({
         id: p.id,
         image_url: p.image_url,
         caption: p.caption,
         created_at: p.created_at,
         author_username: p.profiles?.username || 'Unknown',
         author_avatar_url: p.profiles?.avatar_url || null,
         like_count: p.likes?.[0]?.count ?? 0, 
         comment_count: p.comments?.[0]?.count ?? 0
       }))
    } else {
       feedError = fallbackResponse.error
    }
  } else {
    feed = data || []
  }

  return (
    <div className="flex flex-col w-full h-full relative pb-40">
      
      {/* Top Header Tabs */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-[#2f3336]">
        <div className="flex w-full cursor-pointer h-[53px]">
          <div className="flex-1 hover:bg-white/5 transition-colors flex items-center justify-center relative">
            <span className="font-bold text-[15px] pt-1">For you</span>
            <div className="absolute bottom-0 h-1 bg-[#FF0080] w-14 rounded-full" />
          </div>
          <div className="flex-1 hover:bg-white/5 transition-colors flex items-center justify-center text-[#71767b]">
            <span className="font-medium text-[15px] pt-1">Following</span>
          </div>
        </div>
      </header>

      {/* Composer Area */}
      <div className="px-4 py-3 flex gap-3 border-b border-[#2f3336] w-full">
         <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-neutral-800">
            <img src="/Logo.png" alt="Avatar" className="w-full h-full object-cover p-1 filter invert opacity-50" />
         </div>
         <div className="flex flex-col w-full">
            <input 
              type="text" 
              placeholder="What is happening?!" 
              className="w-full bg-transparent text-xl py-2 outline-none text-white placeholder-neutral-500 mb-2" 
            />
            
            <div className="border-t border-[#2f3336] mt-2 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#FF0080]">
                 <div className="w-[34px] h-[34px] rounded-full hover:bg-[#FF0080]/10 flex items-center justify-center cursor-pointer transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                 <div className="w-[34px] h-[34px] rounded-full hover:bg-[#FF0080]/10 flex items-center justify-center cursor-pointer transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></div>
                 <div className="w-[34px] h-[34px] rounded-full hover:bg-[#FF0080]/10 flex items-center justify-center cursor-pointer transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div>
                 <div className="w-[34px] h-[34px] rounded-full hover:bg-[#FF0080]/10 flex items-center justify-center cursor-pointer transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div>
                 <div className="w-[34px] h-[34px] rounded-full hover:bg-[#FF0080]/10 flex items-center justify-center cursor-pointer transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
              </div>
              <button className="bg-[#FF0080] hover:bg-[#FF0080]/90 font-bold text-[15px] px-5 py-1.5 rounded-full transition-colors opacity-50 cursor-not-allowed">
                 Post
              </button>
            </div>
         </div>
      </div>

      <div className="w-full text-center py-3 border-b border-[#2f3336] text-[#FF0080] hover:bg-white/[0.03] cursor-pointer transition-colors text-[15px]">
         Show 35 posts
      </div>

      {/* Feed Area */}
      <div className="flex flex-col w-full">
        {feedError && (
          <div className="p-4 text-center text-red-500 font-bold text-sm">
            Datastore unavailable
          </div>
        )}

        {feed.map((post) => (
          <PostItem key={post.id} post={post} currentUser={user} />
        ))}
      </div>
    </div>
  )
}
