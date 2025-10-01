module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3000",
      cwd: "/var/lib/jenkins/workspace/fundseekr",
      env: {
        NEXT_PUBLIC_STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
        NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
        STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY,
        NEON_API_KEY: process.env.NEON_API_KEY,
        NEON_PROJECT_ID: process.env.NEON_PROJECT_ID,
        DATABASE_URL: process.env.DATABASE_URL,
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
        BASE_URL: process.env.BASE_URL,
      }
    }
  ]
}
