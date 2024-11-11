'use server'

import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';
import { title } from 'process';
import { redirect } from 'next/navigation';

// Create a new document (room) with access controls
export const createDocument = async ({ userId, email }: { userId: string, email: string }) => {
    const roomId = nanoid();
    
    try {
        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled'
        };

        // Set user access permissions for the room
        const userAccesses: RoomAccesses = {
            [email]: ['room:write']
        };

        // Create the room with metadata and access permissions
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses:userAccesses,
            defaultAccesses: []
        });

        // Optionally revalidate cache after creating the room
        revalidatePath('/');

        // Return the created room data as a stringified JSON
        return parseStringify(room);

    } catch (error: any) {
        console.error('Error occurred while creating the room:', error.message);
        console.error(error.stack);
        throw new Error('Room creation failed');
    }
};

// Fetch an existing document (room) by roomId and verify user access
export const getDocument = async ({ roomId, userId}: { roomId: string, userId: string}) => {
    try {
        // Retrieve room data from Liveblocks
        const room = await liveblocks.getRoom(roomId);

        if (!room) {
            throw new Error('Room not found');
        }

        // Check if the user has access to the room
        const hasAccess = Object.keys(room.usersAccesses).includes(userId); // Use email if access was granted with email

        if (!hasAccess) {
            throw new Error('You do not have access to this document');
        }

        // Return the room data if access is valid
        return parseStringify(room);

    } catch (error: any) {
        console.error('Error occurred while fetching the room:', error.message);
        console.error(error.stack);
        throw new Error('Failed to retrieve document');
    }
};

export const updateDocument=async (roomId:string,documentTitle:string)=>{


try {
   
    const updatedRoom=await liveblocks.updateRoom(roomId,{
        metadata:{
            documentTitle,

        }
    })  

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updatedRoom)

} catch (error) {
    console.log(error)
}
}


export const getDocuments = async ( email: string) => {
    try {
        // Retrieve room data from Liveblocks
        const rooms = await liveblocks.getRooms({userId:email});
      

        // Return the room data if access is valid
        return parseStringify(rooms);

    } catch (error: any) {
        console.error('Error occurred while fetching the rooms:', error.message);
        console.error(error.stack);
        throw new Error('Failed to retrieve document');
    }
};

export const updateDocumentAccess=async ({roomId,email,userType,updatedBy}:ShareDocumentParams)=>{

    try {
             const usersAccesses:RoomAccesses={
                 [email]:getAccessType(userType)as AccessType,
             }    
             const room =await liveblocks.updateRoom(roomId,{usersAccesses})

            if(room){

                const notificationId=nanoid();
                await liveblocks.triggerInboxNotification({
                    userId:email,
                    kind:'$documentAccess',
                    subjectId:notificationId,
                    activityData:{
                        userType,
                        title:`You have been granted ${userType} access to the document by ${updatedBy.name}`,
                        updatedBy:updatedBy.name,
                        avatar:updatedBy.avatar,
                        email:updatedBy.email

                    },
                    roomId
                })


            }
           revalidatePath(`/documents/${roomId}`)

           return parseStringify(room)
    } catch (error) {
        console.log(error)
    }

}

export const removeCollaborator =async ({ roomId,email}:{roomId:string,email:string})=>{
    try {
       
        const room = await liveblocks.getRoom(roomId)
        if(room.metadata.email===email){
            throw new Error('Owner cannot be deleted from the room ')
        }

        const updatedRoom= await liveblocks.updateRoom(roomId,{
            usersAccesses:{
                [email]:null
            }
        })

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedRoom)
    } catch (error) {
         console.log(error)
    }
}

export const deleteDocument=async(roomId:string)=>{

       try {
             await liveblocks.deleteRoom(roomId)
             
             revalidatePath('/')
            
             redirect('/')
        
            
       } catch (error) {
        console.log(error)
       }

}