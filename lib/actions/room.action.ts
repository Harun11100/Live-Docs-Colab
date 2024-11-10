'use server'

import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';
import { title } from 'process';

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
export const getDocument = async ({ roomId, userId, email }: { roomId: string, userId: string, email: string }) => {
    try {
        // Retrieve room data from Liveblocks
        const room = await liveblocks.getRoom(roomId);

        if (!room) {
            throw new Error('Room not found');
        }

        // Check if the user has access to the room
        const hasAccess = Object.keys(room.usersAccesses).includes(email); // Use email if access was granted with email

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
