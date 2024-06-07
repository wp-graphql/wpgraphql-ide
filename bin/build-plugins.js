#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const glob = require('glob');

// Define the path to the plugins directory
const pluginsPath = path.resolve(__dirname, '../plugins');

// Use glob to find all plugin directories
const plugins = glob.sync(`${pluginsPath}/*`);

// Function to build a plugin using wp-scripts
const buildPlugin = (plugin) => {
  const pluginName = path.basename(plugin);
  console.log(pluginName);
  // console.log(`Building plugin: ${pluginName}`);
  // execSync('wp-scripts build', {
  //   cwd: plugin,
  //   stdio: 'inherit',
  // });
};

// Build each plugin
plugins.forEach(buildPlugin);
