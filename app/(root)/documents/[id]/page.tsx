'use client'

import { Editor } from '@/components/editor/Editor'
import Header from '@/components/header'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'

const Documents = () => {
  return (
    <div>
    <Header >
      <div className='flex w-fit items-center justify-center gap-2'>
           <p className='document-title'>This is me from header</p>
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
  )
}

export default Documents