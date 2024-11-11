import AddDocumentBtn from '@/components/AddDocumentBtn'
import Header from '@/components/header'
import { getDocuments } from '@/lib/actions/room.action'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

import Link from 'next/link'
import { dateConverter } from '@/lib/utils'
import { DeleteModal } from '@/components/DeleteModal'
import Notifications from '@/components/Notifications'



const Home = async() => {

  const clerkUser=await currentUser();
  if(!clerkUser)redirect('./sign-in')

  const roomDocuments= await getDocuments(clerkUser.emailAddresses[0].emailAddress)

  

  return (
    <main className='home-container'>
       <Header className='sticky left-0 top-0'>

         <div className='flex items-center gap-2 lg:gap-4'>
          <Notifications/>
          <SignedIn>
            <UserButton/>
          </SignedIn>
         </div>
       </Header>
       {roomDocuments.data.length>0?
       (
        <div className='document-list-container'>
            <div className='document-list-title'>
              <h3 className='text-28-semibold'>All Documents</h3>
               <AddDocumentBtn
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress} 
               />
            </div>
            <ul className='document-ul'>
                 {roomDocuments.data.map(({id,metadata,createdAt}:any)=>(

                   <li key={id} className='document-list-item'>
                    <Link href={`/documents/${id}`} className='flex flex-1 items-center gap-4'>
                     <div className='hidden rounded-md bg-dark-500 p-2 sm:block'>
                     <Image
                     src='/assets/icons/doc.svg'
                     alt="documetns"
                     width={40}
                     height={40}
                     />
                     </div>
                     <div className='space-y-1'>
                      <p className='line-clamp-1 text-lg'>{metadata.title}</p>
                      <p className='text-sm font-light text-blue-100'>created At {dateConverter(createdAt)}</p>
                     </div>
                    
                    
                    </Link>
                    <DeleteModal roomId={id} />

                   </li>
                 ))}
            </ul>
        </div>
       )
       
       : 
       <div className='document-list-empty'>
          <Image
          src='/assets/icons/doc.svg'
          alt='empty doc image'
          width={40}
          height={40}
          className='max-auto'/>

          
          <AddDocumentBtn
           userId={clerkUser.id}
           email={clerkUser.emailAddresses[0].emailAddress} 
          />
         </div>}
       <div>
 

       </div>


    </main>
  )
}

export default Home