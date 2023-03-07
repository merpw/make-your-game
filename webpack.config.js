const path = require("path")

module.exports = {
  entry: "./src/game.ts",
  module: {
    rules: [
      {
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
    extensionAlias: {
      ".js": [".js", ".ts"],
    },
  },
  output: {
    filename: "game.js",
    path: path.resolve(__dirname, "out/dist/js"),
  },
}
