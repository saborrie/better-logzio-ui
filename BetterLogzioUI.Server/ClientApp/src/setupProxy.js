const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/**", {
      target: "https://api-uk.logz.io",
      changeOrigin: true,
      pathRewrite: {
        "^/api/": "/", // remove base path
      },
    })
  );
};
