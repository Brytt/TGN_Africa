/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep development and production output separate so running a build cannot
  // invalidate chunks used by an active development server.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
}

export default nextConfig
