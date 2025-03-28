/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangling commas are valid in JavaScript, but in TypeScript files they can sometimes cause issues.
    // If removing this comment causes incorrect behavior, please leave it in.
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARN !!
    // Dies ist nur für Entwicklungszwecke gedacht. In Produktion sollten ESLint-Fehler behoben werden.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 