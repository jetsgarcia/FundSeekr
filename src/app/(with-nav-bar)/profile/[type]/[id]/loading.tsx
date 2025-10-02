export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

          {/* Header skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
