'use server'

import {nanoid} from 'nanoid'

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


      } catch (error:any) {
            console.error('Error happened while creating the room:', error.message);
            console.error(error.stack);
        }
 }