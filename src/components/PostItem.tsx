'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

function formatCaption(text?: string) {
  if (!text) return "Uploading highly concentrated technical datatypes."
  let formatted = text
    .replace(/(🤖 AI Caption:)/g, '\n\n$1')
    .replace(/(🧠 Explanation:)/g, '\n\n$1')
    .replace(/(🤖 Credit:)/g, '\n\n$1')
  return formatted.replace(/\n{3,}/g, '\n\n').trim()
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h`
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d`
}

export function PostItem({ post, currentUser }: { post: any, currentUser: any }) {
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [isTrexed, setIsTrexed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const timeAgo = getRelativeTime(post.created_at)
  const supabase = createClient()

  // Real database interaction for Like (represented as 😂 emoji in Trexy)
  const handleLike = async () => {
     if (!currentUser || isProcessing) return
     
     setIsProcessing(true)
     const previousLikedState = isLiked
     const previousCount = likeCount

     // Optimistic UI Update
     setIsLiked(!previousLikedState)
     setLikeCount(previousLikedState ? previousCount - 1 : previousCount + 1)
     
     try {
       if (previousLikedState) {
         // Unlike
         await supabase.from('likes').delete().match({ user_id: currentUser.id, post_id: post.id })
       } else {
         // Like
         await supabase.from('likes').insert({ user_id: currentUser.id, post_id: post.id })
       }
     } catch (err) {
       // Revert on failure
       setIsLiked(previousLikedState)
       setLikeCount(previousCount)
     } finally {
       setIsProcessing(false)
     }
  }

  // Gamified interaction specific to Trexy platform
  const handleTrexIt = () => {
     if (isTrexed) return
     setIsTrexed(true)
     // Normally this could trigger the `karma` increment in `profiles` or spawn a confetti animation
  }

  return (
    <article className="border-b border-[#2f3336] px-4 py-3 hover:bg-white/[0.01] transition-colors flex gap-3">
            
      {/* Left Col: Avatar */}
      <div className="shrink-0 pt-1">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800">
           {post.author_avatar_url ? (
             <img src={post.author_avatar_url} alt="Avatar" className="w-full h-full object-cover" />
           ) : (
             <img src="/Logo.png" alt="Avatar" className="w-full h-full object-cover p-1 filter invert opacity-50" />
           )}
        </div>
      </div>

      {/* Right Col: Content */}
      <div className="flex flex-col w-full pb-1">
        
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1.5 text-[15px] max-w-full overflow-hidden whitespace-nowrap">
            <span className="font-bold text-[#e7e9ea] hover:underline cursor-pointer truncate">
              {post.author_username || 'Anonymous'}
            </span>
            {/* Verified Badge */}
            <span className="text-[#FF0080] shrink-0">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.748 1.83 3.42-.047.202-.073.412-.073.627 0 2.21 1.71 3.998 3.918 3.998 1.05 0 2.01-.417 2.72-1.096.953.793 2.158 1.258 3.456 1.258 1.297 0 2.502-.465 3.455-1.258.71.68 1.67 1.096 2.72 1.096 2.21 0 3.918-1.792 3.918-4 0-.215-.026-.425-.073-.627 1.09-.672 1.83-1.96 1.83-3.42zm-12.015 3.938-4.22-4.22 1.488-1.488 2.657 2.657 6.425-6.424 1.56 1.483-8.03 8.017z"/></svg>
            </span>
            <span className="text-[#71767b] truncate">
              @{post.author_username || 'anonymous'}
            </span>
            <span className="text-[#71767b] shrink-0">· {timeAgo}</span>
          </div>
          <button className="text-[#71767b] hover:text-[#FF0080] hover:bg-[#FF0080]/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors -mr-2">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
          </button>
        </div>

        {/* Caption */}
        <div className="text-[15px] leading-normal text-[#e7e9ea] mt-0.5 pb-3 whitespace-pre-wrap break-words">
           {formatCaption(post.caption)}
        </div>

        {/* Media */}
        {post.image_url && (
          <div className="w-full mt-1 border border-[#2f3336] rounded-2xl overflow-hidden bg-black flex items-center justify-center relative cursor-pointer group">
             <img 
               src={post.image_url} 
               alt="Post media" 
               className="w-full h-auto object-cover max-h-[600px]"
             />
             {/* Invisible overlay for capturing double clicks easily if needed */}
             <div className="absolute inset-0 group-hover:bg-white/[0.02] transition-colors" />
          </div>
        )}

        {/* Trexy Action Bar Exactly like Screenshot */}
        <div className="flex items-center justify-between mt-3 max-w-full">
          
          <div className="flex items-center gap-6">
            {/* Emoji Reaction (Like) */}
            <button 
              onClick={handleLike} 
              className="flex items-center gap-1.5 group select-none"
            >
              <div className={`text-[20px] transition-transform duration-300 ${isLiked ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'group-hover:-translate-y-1 group-active:scale-90 scale-100 grayscale-[0.3]'}`}>
                😂
              </div>
              <span className={`text-[14px] font-bold transition-colors ${isLiked ? 'text-white' : 'text-[#71767b] group-hover:text-white'}`}>
                {likeCount}
              </span>
            </button>
            
            {/* Comments */}
            <button className="flex items-center gap-1.5 group select-none">
               <div className="text-[18px] group-hover:-translate-y-1 transition-transform grayscale-[0.3]">
                 💬
               </div>
               <span className="text-[14px] font-bold text-[#71767b] group-hover:text-white transition-colors">
                 {post.comment_count ?? 0}
               </span>
            </button>

            {/* Trex It Custom Gradient Button */}
            <button 
              onClick={handleTrexIt}
              className={`flex items-center gap-2 ml-2 px-4 py-[5px] rounded-full transition-all select-none ${
                isTrexed 
                  ? 'bg-gradient-to-r from-green-400 to-[#1D9BF0] shadow-[0_0_15px_rgba(29,155,240,0.4)] scale-105' 
                  : 'bg-gradient-to-r from-[#FF512F] to-[#DD2476] hover:opacity-90 active:scale-95 shadow-[0_0_10px_rgba(221,36,118,0.2)]'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              <span className="font-black text-white text-[13px]">
                {isTrexed ? 'Trexed!' : 'Trex It'}
              </span>
            </button>
          </div>

          {/* Bookmark */}
          <button className="text-[#71767b] hover:text-white transition-colors group p-2 -mr-2 select-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform group-active:scale-90"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </button>
          
        </div>

      </div>
    </article>
  )
}
