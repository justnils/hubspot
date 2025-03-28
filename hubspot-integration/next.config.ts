/** @type {import('next').NextConfig} */
const nextConfig = {
  // Erlauben Sie den direkten Zugriff auf Umgebungsvariablen
  env: {
    HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN,
    HUBSPOT_API_ENDPOINT: process.env.HUBSPOT_API_ENDPOINT
  }
}

export default nextConfig
