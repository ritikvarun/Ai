import { Liveblocks } from "@liveblocks/node";
import { getCurrentUser } from "@/lib/current-user";
import { NextResponse } from "next/server";

// Initialize Liveblocks Node SDK
const liveblocksSecretKey = process.env.LIVEBLOCKS_SECRET_KEY;
const liveblocks = liveblocksSecretKey && liveblocksSecretKey !== "sk_test_placeholder"
  ? new Liveblocks({ secret: liveblocksSecretKey })
  : null;

export async function POST(request: Request) {
  try {
    // 1. Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Parse room ID from request body
    const { room } = await request.json();
    if (!room) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    // 3. Extract user info
    const email = user.emailAddresses[0]?.emailAddress || "anonymous@example.com";
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || email;
    const avatar = user.imageUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

    // 4. If Liveblocks is not configured, send back a mock signature or let client know
    if (!liveblocks) {
      console.warn("Liveblocks is not configured (missing secret key). Returning mock authorization.");
      // Return a simulated response for local development when credentials are unset
      return NextResponse.json({
        token: "mock-token",
        user: { id: user.id, info: { name, email, avatar } }
      });
    }

    // 5. Create authorization session
    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name,
        email,
        avatar,
      },
    });

    // 6. Grant access to the specific board room
    // Give full access to the board room
    session.allow(room, session.FULL_ACCESS);

    // 7. Authorize and return token
    const { status, body } = await session.authorize();
    return new NextResponse(body, { status });
  } catch (error) {
    console.error("Error in Liveblocks auth route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
