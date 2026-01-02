/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/nimblepanda-solutions',
  assetPrefix: '/nimblepanda-solutions/',
}

module.exports = nextConfig
