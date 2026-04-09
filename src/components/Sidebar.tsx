'use client'

import { Logo } from '@/components/Logo'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Compass, Newspaper, Mail, User, Settings, LogOut, Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Notice we use the exact styling logic observed: Active colors are Pink/Magenta
  const tabs = [
    { name: 'Feed', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Messages', href: '/messages', icon: Mail },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed top-0 left-0 w-[80px] xl:w-[280px] h-screen border-r border-[#1c1b22] bg-[#0b0a10]/95 backdrop-blur-xl z-50 flex flex-col justify-between py-6 px-4">
      <div className="flex flex-col gap-6 h-full">
        <div className="flex xl:justify-start justify-center px-0 xl:px-4">
          <Logo width={45} className="xl:hidden pb-4" />
          <Logo width={85} className="hidden xl:flex pb-6 border-b border-[#1c1b22] w-full" />
        </div>

        <nav className="flex flex-col gap-[6px] mt-2 overflow-y-auto hidden-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
            
            return (
              <Link 
                key={tab.name} 
                href={tab.href}
                className={`flex items-center gap-5 p-[14px] rounded-[1.2rem] transition-all group ${
                  isActive 
                  ? 'font-black text-[#FF0080]' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} className="shrink-0 transition-transform group-active:scale-95" />
                <span className="text-[17px] hidden xl:inline-block tracking-wide">{tab.name}</span>
              </Link>
            )
          })}

          <button className="flex items-center gap-5 p-[14px] rounded-[1.2rem] transition-all group text-white/60 hover:bg-white/5 hover:text-red-500 font-bold mt-2" onClick={handleLogout}>
            <LogOut size={26} strokeWidth={2} className="shrink-0 transition-transform group-active:scale-95" />
            <span className="text-[17px] hidden xl:inline-block tracking-wide">Logout</span>
          </button>
        </nav>

        <div className="flex items-center justify-center mt-auto mb-2">
          {/* Post button mirroring the beautiful floating '+' circle from the mobile tab bar */}
          <button className="w-full xl:w-auto xl:px-12 bg-transparent text-[#FF0080] rounded-full flex items-center justify-center p-3 xl:py-4 transition-all hover:opacity-90 active:scale-[0.98] shadow-[0_0_20px_rgba(255,0,128,0.2)] border-2 border-t-[#FF0080] border-r-[#FF0080] border-b-[#00FFFF] border-l-[#00FFFF]">
            <Plus size={30} className="xl:hidden block" strokeWidth={3} />
            <span className="font-black text-[18px] hidden xl:block tracking-wide flex items-center gap-4">
              <Plus size={24} strokeWidth={3} /> Post
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
