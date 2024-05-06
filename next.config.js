/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: [
      'thumbs2.imgbox.com',
      'hdzvdow6m5g3rt4x.public.blob.vercel-storage.com',
      'https://lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdzvdow6m5g3rt4x.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};
