import { stackServerApp } from "@/stack";
import PendingVerification from "@/components/home/pending-verification";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Check database for legal verification status
  const dbUser = await prisma.users_sync.findUnique({
    where: { id: user.id },
    select: { raw_json: true },
  });

  // Extract legal verification status from database
  const dbLegalVerified =
    dbUser?.raw_json &&
    typeof dbUser.raw_json === "object" &&
    dbUser.raw_json !== null &&
    "server_metadata" in dbUser.raw_json &&
    dbUser.raw_json.server_metadata &&
    typeof dbUser.raw_json.server_metadata === "object" &&
    "legalVerified" in dbUser.raw_json.server_metadata
      ? dbUser.raw_json.server_metadata.legalVerified
      : null;

  // If database has legal verification status but Stack user doesn't, update Stack user
  if (
    dbLegalVerified !== null &&
    user.serverMetadata?.legalVerified !== dbLegalVerified
  ) {
    try {
      await user.update({
        serverMetadata: {
          ...user.serverMetadata,
          legalVerified: dbLegalVerified,
        },
      });
    } catch (error) {
      console.error("Failed to sync legal verification status:", error);
    }
  }

  // Use the database value as the source of truth, fallback to Stack user metadata
  const legalVerified = dbLegalVerified ?? user?.serverMetadata?.legalVerified;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {legalVerified ? <div></div> : <PendingVerification />}
      </div>
    </div>
  );
}
