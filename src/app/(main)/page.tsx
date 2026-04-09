import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

// Defines the expected payload from the Supabase RPC functions
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

  // Strict Protection Check: globally secure the main routes.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Attempt to fetch real algorithmic feed via RPC
  let feed: PostPayload[] = []
  let feedError = null

  const { data, error } = await supabase.rpc('get_recommended_posts', { 
    target_user_id: user.id 
  })

  // 2. If the RPC fails (e.g. not deployed yet on this environment), fallback to a basic table fetch
  if (error) {
    console.warn("RPC 'get_recommended_posts' failed or missing. Falling back to basic fetch.", error)
    
    // Fallback: Just grab the latest 10 posts from the table
    const fallbackResponse = await supabase
      .from('posts')
      .select(`
        id, 
        image_url, 
        caption, 
        created_at,
        profiles!posts_user_id_fkey (username, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (fallbackResponse.data) {
       // Map to standard payload shape
       feed = fallbackResponse.data.map((p: any) => ({
         id: p.id,
         image_url: p.image_url,
         caption: p.caption,
         created_at: p.created_at,
         author_username: p.profiles?.username || 'Unknown',
         author_avatar_url: p.profiles?.avatar_url || null,
         like_count: 0, // Fallbacks don't easily have aggregates unless we join likes table
         comment_count: 0
       }))
    } else {
       feedError = fallbackResponse.error
    }
  } else {
    feed = data || []
  }

  return (
    <div className="flex flex-col w-full min-h-screen pb-20">
      
      {/* Sticky Top Nav */}
      <header className="sticky top-0 z-30 bg-[#0b0a10]/80 backdrop-blur-2xl border-b border-[#1c1b22] flex flex-col">
        {/* Mobile-only Search Bar & Bell */}
        <div className="flex lg:hidden items-center justify-between px-4 py-3 gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF512F] to-[#DD2476] p-[2px] shrink-0">
            <div className="w-full h-full bg-white/10 rounded-full" />
          </div>
          <div className="relative flex items-center w-full">
               <div className="absolute left-3 text-white/50 pointer-events-none">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
               <input 
                 type="text" 
                 placeholder="Search memes..." 
                 className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#1c1b22] border border-transparent text-white placeholder-white/50 focus:outline-none focus:border-[#FF0080]/50 transition-all font-semibold text-sm"
               />
          </div>
          <div className="text-white/80 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
        </div>

        {/* Tab Selection Row exactly like screenshot */}
        <div className="flex items-center justify-around font-bold text-[15px] pt-1">
          <button className="relative py-4 text-[#FF0080] w-full flex justify-center transition-colors">
            For You
            <div className="absolute bottom-0 h-1 bg-[#FF0080] w-[40%] rounded-t-full" />
          </button>
          <button className="py-4 text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors">
            Following
          </button>
          <button className="py-4 text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors">
            Trending
          </button>
        </div>
      </header>

      {/* Feed Area */}
      <div className="flex flex-col relative w-full border-t border-[#1c1b22]">
        
        {feedError && (
          <div className="p-8 text-center text-red-500 font-bold border border-red-500/20 bg-red-500/5 m-4 rounded-2xl">
            Critical Backend Connection Subsystem Error: Could not fetch feed. Check `.env.local` and Supabase DB.
          </div>
        )}

        {feed.length === 0 && !feedError && (
          <div className="p-20 text-center text-white/50 font-bold">
            <div className="text-4xl mb-4 opacity-50">🦕</div>
            The primary datastore contains no memes yet. Start posting to build the "For You" algorithm.
          </div>
        )}

        {/* Dynamic Mapping from Supabase payload */}
        {feed.map((post) => {
          const postDate = new Date(post.created_at).toLocaleDateString('en-GB') // 27/3/2026 format mapping

          return (
          <article key={post.id} className="border-b border-[#1c1b22] pt-4 pb-2 hover:bg-white/[0.02] transition-colors">
            
            {/* Post Header */}
            <div className="flex justify-between items-center px-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-tr from-[#FF0080] to-red-500 p-[2px]">
                  <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center p-0.5 relative">
                     {post.author_avatar_url ? (
                       <Image src={post.author_avatar_url} alt="Avatar" fill className="object-cover rounded-full" />
                     ) : (
                       <Image src="/Logo.png" alt="Avatar" width={30} height={30} className="object-contain filter invert opacity-50" />
                     )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-[15px] leading-tight">
                    {post.author_username || 'Anonymous'}
                  </span>
                  <span className="text-white/40 text-[13px] font-semibold">{postDate}</span>
                </div>
              </div>
              <button className="text-white/60 hover:text-white p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
              </button>
            </div>

            {/* Post Content Media */}
            <div className="w-full relative bg-[#0f0e13] flex items-center justify-center overflow-hidden border-y border-[#1c1b22]/50 mb-4 h-auto min-h-[300px]">
              
              {/* Native Next/Image rendering actual DB Payload Image */}
              {post.image_url ? (
                 <img 
                   src={post.image_url} 
                   alt={post.caption || "Meme"} 
                   className="w-full h-auto object-contain max-h-[80vh]"
                 />
              ) : (
                <div className="p-10 font-mono text-white/50 text-center">
                  Image Payload Missing
                </div>
              )}
            </div>

            {/* ActionBar exactly like bottom of screenshot */}
            <div className="flex items-center justify-between px-4 mb-2">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 group">
                  <span className="text-[22px] group-hover:scale-110 transition-transform">😂</span>
                  <span className="font-bold text-white">{post.like_count || 0}</span>
                </button>
                
                <button className="flex items-center gap-2 text-white group">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span className="font-bold">{post.comment_count || 0}</span>
                </button>

                {/* The Signature Gamified Action */}
                <button className="flex items-center gap-2 ml-2 px-5 py-[6px] rounded-full bg-gradient-to-r from-[#FF512F] to-[#DD2476] hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(221,36,118,0.3)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  <span className="font-black text-white text-[14px]">Trex It</span>
                </button>
              </div>

              <button className="text-white/60 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
            </div>

            {/* Dynamically bind caption if provided */}
            {post.caption && (
              <div className="px-4 pb-2">
                <p className="text-[14px] leading-snug break-words">
                  <span className="font-bold mr-2 text-white">{post.author_username || 'Anonymous'}</span>
                  <span className="text-white/90">{post.caption}</span>
                </p>
              </div>
            )}
            {!post.caption && (
              <div className="px-4 pb-2">
                 <p className="text-white/40 italic text-xs">No caption provided</p>
              </div>
            )}
          </article>
        )})}
        
      </div>
    </div>
  )
}
