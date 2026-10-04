/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects () {
    return [
      { source: '/projects', destination: '/#proyectos', permanent: false },
      { source: '/about', destination: '/#sobre-mi', permanent: false }
    ]
  }
}

module.exports = nextConfig
