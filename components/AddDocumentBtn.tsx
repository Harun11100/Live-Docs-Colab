'use client'

import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { createDocument, createDoument } from '@/lib/actions/room.action'
import { useRouter } from 'next/navigation'
const AddDocumentBtn = ({userId,email}:AddDocumentBtnProps) => {
     
      const router=useRouter()
     
     
      const addDocumenthandler= async()=>{
      
             try {

                 const room = createDocument({userId,email}) 
            if(room) router.push(`/documents/${room.id}`)
             } catch (error) {
                console.log(error)  
             }


      }
  
      return (
    <Button type='submit' 
    className='gradient-blue flex gap-1 shadow-md'
    onClick={addDocumenthandler}>
   
      <Image
      
      src='/assets/icons/add.svg'
      alt='add'
      width={25}
      height={25}
      />
      <p className='hidden sm:block '>Create a new document</p>

    </Button>

  )
}

export default AddDocumentBtn