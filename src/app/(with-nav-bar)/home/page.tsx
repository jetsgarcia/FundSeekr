import { stackServerApp } from "@/stack";
import PendingVerification from "@/components/home/pending-verification";

export default async function HomePage() {
  const user = await stackServerApp.getUser();
  const legalVerified = user?.serverMetadata?.legalVerified;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {legalVerified ? <div></div> : <PendingVerification />}
      </div>
    </div>
  );
}
