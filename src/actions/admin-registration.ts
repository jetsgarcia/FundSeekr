"use server";

import { stackServerApp } from "@/stack";

interface RegistrationResult {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
  error?: string;
}

export async function registerAdminUser(
  email: string,
  name?: string
): Promise<RegistrationResult> {
  try {
    // Validate required fields
    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }

    // Check if current user is authorized to create admin users
    const currentUser = await stackServerApp.getUser();
    if (!currentUser || currentUser.serverMetadata?.userType !== "Admin") {
      return {
        success: false,
        message: "Unauthorized: Only admins can create admin users",
      };
    }

    try {
      const newUser = await stackServerApp.createUser({
        primaryEmail: email,
        displayName: name || email.split("@")[0],
        serverMetadata: {
          userType: "Admin",
          createdBy: currentUser.id,
        },
      });

      return {
        success: true,
        message: "Admin user created successfully",
        data: {
          userId: newUser.id,
          email: newUser.primaryEmail || email,
        },
      };
    } catch (stackError) {
      console.error("Stack Auth error:", stackError);

      return {
        success: false,
        message: "Failed to create admin user",
        error:
          stackError instanceof Error ? stackError.message : "Unknown error",
      };
    }
  } catch (error) {
    console.error("Admin registration error:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
