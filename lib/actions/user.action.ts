'use server'

import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";


export const getClerkUser= async({userIds}:{userIds:string[]})=>{

try {
    
    const {data}= await clerkClient.users.getUserList({
      emailAddress:userIds,
    })   
    const users= data.map((user)=>({
      id:user.id,
      name:`${user.firstName} ${user.lastName}`,
      email:user.emailAddresses[0].emailAddress,
      avatar:user.imageUrl
    }));

    const sortedUsers=userIds.map((email)=>users.find((user)=>
user.email===email))

    return parseStringify(sortedUsers);
} catch (error) {
   console.log(error)   
}
}

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {

    const { data } = await clerkClient.users.getUserList({
      userId: userIds,
    });
    console.log(data)
  
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));

    // Sort users by the original userIds order
    const sortedUsers = userIds.map((id) => users.find((user) => user.id === id));

    return parseStringify(sortedUsers);
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
    console.log(clerkClient)
  }
};



export const getDocumentUsers =async({roomId,currentUser,text}:{roomId:string,text:string,currentUser:string})=>{


try {
      const room = await liveblocks.getRoom(roomId)
      const users =Object.keys(room.usersAccesses).filter((email)=>email !==currentUser)
  
      if(text.length){
        const lowerCaseText=text.toLocaleLowerCase()

        const filteredUsers=users.filter((email:string)=>email.toLocaleLowerCase().includes(lowerCaseText))
        
        return parseStringify(filteredUsers)
      
      }

      return parseStringify(users)


} catch (error) {
  console.log('Error fatching documents users',error)
}

}