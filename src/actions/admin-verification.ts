"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function approveUser(userId: string) {
  try {
    // Update the user's verification status
    // For now, we'll add a simple approach by updating the user record
    // You might want to add a verification status field to your database schema
    
    const user = await prisma.users_sync.findUnique({
      where: { id: userId },
      include: {
        startups: true,
        investors: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // You might want to add verification status to your schema
    // For now, we'll just redirect back
    console.log(`User ${userId} approved by admin`);
    
    // In a real application, you might:
    // 1. Send email notification to user
    // 2. Update user status in database
    // 3. Log the admin action
    // 4. Update any verification flags

  } catch (error) {
    console.error("Error approving user:", error);
    throw new Error("Failed to approve user");
  }

  redirect("/admin/verification");
}

export async function rejectUser(userId: string, reason?: string) {
  try {
    const user = await prisma.users_sync.findUnique({
      where: { id: userId },
      include: {
        startups: true,
        investors: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log(`User ${userId} rejected by admin. Reason: ${reason || "No reason provided"}`);
    
    // In a real application, you might:
    // 1. Send email notification to user with rejection reason
    // 2. Update user status in database
    // 3. Log the admin action
    // 4. Soft delete the profile or mark as rejected

  } catch (error) {
    console.error("Error rejecting user:", error);
    throw new Error("Failed to reject user");
  }

  redirect("/admin/verification");
}