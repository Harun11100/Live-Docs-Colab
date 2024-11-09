 'use client'

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import React, { ReactNode, useRef, useState } from 'react'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborator from './ActiveCollaborator'
import { Input } from './ui/input'
import Image from 'next/image'
const  CollaborativeRoom = ({roomId,roomMetadata}:CollaborativeRoomProps) => {
  
     const currentUserType = roomId

     const [documentTitle,setDocumentTitle]=useState(roomMetadata.title)
       
     const [editing,setEditiing]=useState(false)
     const [loading,setLoading]=useState(false)
     
     const containerRef=useRef<HTMLDivElement>(null)
     const InputRef=useRef<HTMLDivElement>(null)
      
     const updateTitleHandler =(e:React.KeyboardEvent<HTMLInputElement>)=>{

     }


     return (
      <RoomProvider id="my_room">

            <ClientSideSuspense fallback={<div>Loading…</div>}>

                        <div className='collaborative-room'>

                  <Header >
                        <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
                           {editing && !loading ?(
                              <Input
                              type='text'
                              value={documentTitle}
                              placeholder='Enter title'
                              ref={InputRef}
                              onChange={(e)=>{setDocumentTitle(e.target.value)}}
                              onKeyDown={updateTitleHandler}
                              disabled={!editing}
                              className='document-title-input'
                              />
                           ):(
                              <p className='document-title'>{documentTitle}</p>
                           )}
                           {currentUserType==='editor' && ! editing &&(
                               <Image
                               src='/assets/icons/edit.svg'
                               alt='editor'
                               width={25}
                               height={25} 
                               onClick={()=>setEditiing(true)}
                               className='pointer'
                               />
                           )}
                           {currentUserType !=='editor' && !editing &&(
                              <p className='view-only-tag'>View only</p>
                           )}

                           {loading&& (
                              <p className='text-sm text-gray-400'> saving...</p>
                           )}


                        </div>
                        <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3 '>
                             <ActiveCollaborator/>
                        </div>

                        <SignedOut>
                           <SignInButton/>
                        </SignedOut>
                        <SignedIn>
                            <UserButton/>
                        </SignedIn>
                  </Header>
                        <Editor/>

                        </div>

            </ClientSideSuspense>

    </RoomProvider>
  )
}

export default CollaborativeRoom