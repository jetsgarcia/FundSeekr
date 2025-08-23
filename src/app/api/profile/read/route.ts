import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/bigint-serializer";

export async function GET() {
  try {
    // Get user id
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Get user type (investor or startup) by checking which table has their record
    const [investor, startup] = await Promise.all([
      prisma.investors.findFirst({
        where: { user_id: userId },
        include: {
          users_sync: true,
        },
      }),
      prisma.startups.findFirst({
        where: { user_id: userId },
        include: {
          users_sync: true,
          funding_requests: true,
        },
      }),
    ]);

    // If user is investor - get from investors table
    if (investor) {
      return NextResponse.json({
        userType: "investor",
        profile: serializeBigInt(investor),
      });
    }

    // If user is startup - get from startups table
    if (startup) {
      return NextResponse.json({
        userType: "startup",
        profile: serializeBigInt(startup),
      });
    }

    // If user exists but no profile found
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
