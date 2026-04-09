import { Sidebar } from '@/components/Sidebar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Crucial Change: flex justify-center wraps everything, capping constraints nicely.
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF0080]/40 selection:text-white flex justify-center">
      
      {/* Max-Width constraint centered on the screen imitating X layout boundaries on ultra-wide monitors */}
      <div className="w-full max-w-[1265px] flex justify-between relative">
        
        {/* Side Navigation strictly bound to its own column */}
        <div className="w-[80px] xl:w-[275px] shrink-0">
           <Sidebar />
        </div>

        {/* Main Content Area (Feed + Right Sidebar) safely sitting beside Sidebar */}
        <main className="flex-1 flex justify-between z-10 w-full min-h-screen">
          
          {/* Strict 600px middle column perfectly matching X */}
          <div className="w-full max-w-[600px] border-x border-[#2f3336] min-h-screen bg-black flex flex-col shrink-0">
            {children}
          </div>
          
          {/* Right Sidebar strictly matching X screenshot */}
          <div className="hidden lg:block w-[350px] p-4 lg:ml-4 relative shrink-0">
            <div className="sticky top-0 space-y-4 pt-1 z-20">
              
              {/* Search Bar Block */}
              <div className="relative flex items-center w-full group bg-black pb-2 pt-1">
                <div className="absolute left-5 text-neutral-500 group-focus-within:text-[#FF0080] transition-colors pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-[#202327] border border-transparent text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF0080] focus:bg-black transition-all text-[15px]"
                />
              </div>

              {/* Subscribe to Premium Box */}
              <div className="bg-[#16181c] rounded-2xl p-4 border border-[#2f3336]">
                  <h3 className="font-extrabold text-[20px] mb-2 flex items-center">
                    Subscribe to Premium 
                    <span className="ml-2 bg-[#00ba7c]/20 text-[#00ba7c] text-[11px] px-2 py-0.5 rounded uppercase tracking-wide">50% off</span>
                  </h3>
                  <p className="text-[15px] leading-tight mb-4 text-[#e7e9ea] font-medium">
                    Get rid of ads, see your analytics, boost your replies and unlock 20+ features.
                  </p>
                  <button className="bg-[#FF0080] hover:bg-[#FF0080]/90 text-white font-bold text-[15px] py-1.5 px-4 rounded-full transition-colors">
                    Subscribe
                  </button>
              </div>

              {/* Today's News Box */}
              <div className="bg-[#16181c] rounded-2xl border border-[#2f3336] overflow-hidden">
                  <div className="p-4 py-3">
                    <h3 className="font-extrabold text-[20px]">Today's News</h3>
                  </div>
                  
                  <div className="flex flex-col">
                    {[
                      { title: "Prabhas and Sandeep Reddy Vanga Watch Ranveer Singh's Dhurandhar Together in...", topic: "Entertainment", posts: "130.3K posts", ago: "1 day ago" },
                      { title: "Dhurandhar: The Revenge becomes first Indian film to cross 1000 crore net in Hind...", topic: "Entertainment", posts: "80.9K posts", ago: "6 hours ago" },
                      { title: "Priyanka Purohit and lover Kamlesh arrested in Dhar, Madhya Pradesh for...", topic: "News", posts: "8,741 posts", ago: "6 hours ago" }
                    ].map((news, i) => (
                      <div key={i} className="px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors">
                        <p className="font-bold text-[15px] leading-snug">{news.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-[13px] text-neutral-500 font-medium">
                          <div className="w-4 h-4 rounded-full bg-neutral-700 shrink-0"></div>
                          <span>{news.ago}</span>
                          <span>·</span>
                          <span>{news.topic}</span>
                          <span>·</span>
                          <span>{news.posts}</span>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
              
              {/* Simple Footer Links */}
              <div className="px-4 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-neutral-500">
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Cookie Policy</a>
                <a href="#" className="hover:underline">Accessibility</a>
                <a href="#" className="hover:underline">Ads info</a>
                <span>© 2026 Trex Corp.</span>
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
