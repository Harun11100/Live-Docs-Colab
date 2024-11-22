import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
    const clerkUser = await currentUser();

    // Check for user authentication and email existence
    if (!clerkUser || !clerkUser.emailAddresses?.[0]?.emailAddress) {
        console.error("User not authenticated or email not found.");
        return new Response(null, {
            status: 307,
            headers: { Location: '/sign-in' },
        });
    }

    const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

    const user = {
        id,
        info: {
            id,
            name: `${firstName} ${lastName}`,
            email: emailAddresses[0].emailAddress,
            avatar: imageUrl,
            color: getUserColor(id),
        },
    };

    try {
        const { status, body } = await liveblocks.identifyUser(
            {
                userId: user.info.email,
                groupIds: [],
            },
            {
                userInfo: user.info,
            }
        );

        return new Response(JSON.stringify(body), {
            status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in /api/liveblocks-auth:', error.message, error.stack);
        return new Response('Authentication failed', { status: 500 });
    }
}
