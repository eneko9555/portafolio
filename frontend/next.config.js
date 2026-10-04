/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects () {
    return [
      { source: '/projects', destination: '/#proyectos', permanent: false }
    ]
  }
}

module.exports = nextConfig
