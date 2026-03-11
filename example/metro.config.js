const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, "..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.disableHierarchicalLookup = true;

config.resolver.extraNodeModules = {
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  react: path.resolve(projectRoot, "node_modules/react"),
};

module.exports = withNativeWind(config, {
  input: "./src/globals.css",
  inlineRem: 16,
});
