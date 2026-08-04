/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The generated OG images read the Heebo font files at runtime; make sure
  // they are traced into the serverless bundle for on-demand rendered names.
  outputFileTracingIncludes: {
    '/opengraph-image': ['./assets/fonts/Heebo-Regular.ttf', './assets/fonts/Heebo-Bold.ttf'],
    '/name/[name]/opengraph-image': [
      './assets/fonts/Heebo-Regular.ttf',
      './assets/fonts/Heebo-Bold.ttf',
    ],
    '/rare/opengraph-image': ['./assets/fonts/Heebo-Regular.ttf', './assets/fonts/Heebo-Bold.ttf'],
    '/top-names/opengraph-image': [
      './assets/fonts/Heebo-Regular.ttf',
      './assets/fonts/Heebo-Bold.ttf',
    ],
    '/stories/opengraph-image': [
      './assets/fonts/Heebo-Regular.ttf',
      './assets/fonts/Heebo-Bold.ttf',
    ],
    '/stories/[slug]/opengraph-image': [
      './assets/fonts/Heebo-Regular.ttf',
      './assets/fonts/Heebo-Bold.ttf',
    ],
  },
};

export default nextConfig;
