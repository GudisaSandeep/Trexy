'use client'

import { Logo } from '@/components/Logo'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, Bell, Mail, User, Bookmark, CircleEllipsis, Feather } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Messages', href: '/messages', icon: Mail },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    // Replaced 'fixed left-0' with 'sticky top-0' 
    // This allows the sidebar to perfectly nest inside the centered parent layout box on wide monitors
    <aside className="sticky top-0 h-screen w-full bg-black z-50 flex flex-col justify-between py-4 px-2 xl:px-4 overflow-y-auto overflow-x-hidden hidden-scrollbar">
      <div className="flex flex-col xl:items-start items-center gap-1 h-full w-full">
        {/* Logo matching top left X positioning */}
        <div className="flex items-center justify-center w-[52px] h-[52px] hover:bg-neutral-900 rounded-full transition-colors mb-2 cursor-pointer">
          <Logo width={35} />
        </div>

        <nav className="flex flex-col w-full xl:w-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
            
            return (
              <Link 
                key={tab.name} 
                href={tab.href}
                className="flex items-center group w-full xl:w-fit py-1"
              >
                <div className={`flex items-center xl:gap-5 p-3 px-3 xl:pr-6 xl:pl-3 rounded-full transition-colors xl:w-auto w-fit mx-auto ${
                  isActive ? 'font-bold text-white' : 'text-neutral-200 hover:bg-neutral-900'
                }`}>
                   <div className="relative">
                     {tab.name === 'Notifications' && <div className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white border border-black z-10">3</div>}
                     <Icon size={26} strokeWidth={isActive ? 3 : 2} className="shrink-0" />
                   </div>
                   <span className="text-xl hidden xl:inline-block pt-1">{tab.name}</span>
                </div>
              </Link>
            )
          })}
          
          <button className="flex items-center group w-full xl:w-fit py-1">
            <div className="flex items-center xl:gap-5 p-3 px-3 xl:pr-6 xl:pl-3 rounded-full transition-colors text-neutral-200 hover:bg-neutral-900 xl:w-auto w-fit mx-auto">
              <CircleEllipsis size={26} strokeWidth={2} className="shrink-0" />
              <span className="text-xl hidden xl:inline-block pt-1">More</span>
            </div>
          </button>
        </nav>

        {/* X-style prominent post button */}
        <div className="w-full mt-4 flex justify-center xl:justify-start px-1 xl:px-0">
          <button className="bg-[#FF0080] hover:bg-[#FF0080]/90 text-white rounded-full w-[52px] h-[52px] xl:w-[90%] xl:h-[52px] flex items-center justify-center shadow-md transition-colors">
            <Feather size={24} className="xl:hidden block" strokeWidth={2.5} />
            <span className="font-bold text-lg hidden xl:block">Post</span>
          </button>
        </div>
      </div>

      {/* Mini Profile at bottom */}
      <div className="w-full mt-auto mb-2 px-1 xl:px-0 cursor-pointer pt-4">
        <div className="flex items-center justify-center xl:justify-between hover:bg-neutral-900 rounded-full p-2 xl:p-3 transition-colors" onClick={handleLogout}>
          <div className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-tr from-[#FF512F] to-[#DD2476] p-[2px]">
             <div className="w-full h-full bg-neutral-800 rounded-full flex items-center justify-center p-1">
                <img src="/Logo.png" alt="Avatar" className="w-full h-full object-contain filter invert" />
             </div>
          </div>
          <div className="hidden xl:flex flex-col ml-3 mr-auto h-full justify-center overflow-hidden">
             <span className="text-white text-[15px] font-bold leading-none truncate">Trexy</span>
             <span className="text-neutral-500 text-[15px] leading-none pt-1 truncate">@trexy_root</span>
          </div>
          <div className="hidden xl:block text-white ml-2 shrink-0">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </div>
        </div>
      </div>
    </aside>
  )
}
