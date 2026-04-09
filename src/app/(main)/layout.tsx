import { Sidebar } from '@/components/Sidebar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0b0a10] relative flex text-white font-sans selection:bg-[#FF0080]/30 selection:text-[#FF0080]">
      {/* Side Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-[80px] xl:ml-[280px] flex justify-center z-10 w-full overflow-x-hidden">
        {/* Strict 600px max-w layout for standard infinite scroll social feed framing */}
        <div className="w-full max-w-[600px] border-r border-[#1c1b22] min-h-screen bg-[#0b0a10]">
          {children}
        </div>
        
        {/* Right Sidebar for Trending/AI Tags/Scores */}
        <div className="hidden lg:block w-[380px] p-6 lg:ml-2 relative">
          <div className="sticky top-6 space-y-6">
             
             {/* Right Column Search Bar (moved from mobile top bar to desktop right bar) */}
             <div className="relative flex items-center w-full">
               <div className="absolute left-4 text-white/50 pointer-events-none">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
               <input 
                 type="text" 
                 placeholder="Search memes..." 
                 className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[#1c1b22] border border-transparent text-white placeholder-white/50 focus:outline-none focus:border-[#FF0080]/50 focus:bg-[#0b0a10] transition-all font-semibold"
               />
             </div>

             <div className="bg-[#131218] rounded-[1.5rem] p-6 border border-[#1c1b22]">
                <h3 className="font-display font-black text-[20px] tracking-tight mb-4 text-white">Who to follow</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center justify-between">
                       <div className="flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF512F] to-[#DD2476] p-[2px]">
                           <div className="w-full h-full bg-[#1c1b22] rounded-full" />
                         </div>
                         <div className="flex flex-col">
                           <span className="font-bold text-sm">Tech User</span>
                           <span className="text-white/40 text-xs">@techuserr</span>
                         </div>
                       </div>
                       <button className="bg-white text-black font-bold text-sm px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors">
                         Follow
                       </button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
