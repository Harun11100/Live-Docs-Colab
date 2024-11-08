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
            title:'Untitled'
      }

      const usersAccesses:RoomAccesses={
             [email]:['room:write']
      }

      const room =await liveblocks.createRoom(roomId,{
            metadata,
            usersAccesses,
            defaultAccesses:[]
      })

      revalidatePath('/')

      return parseStringify(room)


      } catch (error:any) {
            console.error('Error happened while creating the room:', error.message);
            console.error(error.stack);
        }
 }

 export const getDocument = async ({roomId,userId}:{roomId:string,userId:string})=>{


       try {
            const room =await liveblocks.getRoom(roomId)
         
            const hasAccess=Object.keys(room.usersAccesses).includes(userId)
   
            if(!hasAccess){
               throw new Error ('You do not have access ti this documents')
            }
            return parseStringify(room)
       } catch (error) {
             console.log(error)
       }
 }