import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function POST(request: Request) {

   const clerkUser= await currentUser() 
  // Get the current user from your database
    if(!clerkUser) redirect('./sign-in')


   const {id,firstName,lastName,emailAddresses,imageUrl}=clerkUser
   
   const user ={
         id,
         info:{
            id,
           name:`${firstName} ${lastName}`,
            email:emailAddresses[0].emailAddress,
            avatar:imageUrl,
            color:getUserColor(id) 
         }
   }

const email = emailAddresses[0]?.emailAddress;
if (!email) {
    console.error("User email not found.");
    redirect('/sign-in');
}


try {
  const { status, body } = await liveblocks.identifyUser({
      userId: user.info.email,
      groupIds: []
  }, {
      userInfo: user.info
  });
  return new Response(body, { status });
} catch (error) {
  console.error('Error in /api/liveblocks-auth:', error);
  return new Response('Authentication failed', { status: 500 });
}

} 

