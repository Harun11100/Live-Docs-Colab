'use server'

import {nanoid} from 'nanoid'
import { title } from 'process';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';
 export const createDoument =async ({userId,email}:CreateDocumentParams)=>{
     
      
      const roomId= nanoid() ;
      try {
               
          const metadata={
            creatorId:userId,
            email,
            title:'nothing titled'
      }

      const userAccesses:RoomAccesses={
             [email]:['room:write']
      }

      const room =await liveblocks.createRoom(roomId,{
            metadata,
            userAccesses,
            defaultAccesses:[]
      })

      revalidatePath('/')

      return parseStringify(room)


      } catch (error) {
            console.log('Error happed while crateing the room ',error)
      }
 }