/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: 'vercel',
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server:
    !process.env.VERCEL || process.env.NODE_ENV === 'development'
      ? undefined
      : './server.js',
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: ['@chess/chess', 'nanoid'],
  future: {
    v2_routeConvention: true,
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "api/index.js",
  // publicPath: "/build/",
};
