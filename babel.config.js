module.exports = function (api) {
  // Configure caching
  api.cache.using(() => process.env.NODE_ENV);

  // Only use Babel for tests
  if (process.env.NODE_ENV === "test") {
    return {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-react", { runtime: "automatic" }],
        "@babel/preset-typescript",
      ],
    };
  }

  // Return empty config for non-test environments (Next.js will handle compilation)
  return {};
};
