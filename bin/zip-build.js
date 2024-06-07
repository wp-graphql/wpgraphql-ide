#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Define the path to the root build directory
const buildPath = path.resolve(__dirname, '../build');
const zipPath = path.resolve(__dirname, '../wpgraphql-ide.zip');

// Function to zip a directory
const zipDirectory = (source, out) => {
  const zipCommand = `zip -r ${out} ${source}`;
  execSync(zipCommand, { stdio: 'inherit' });
};

// Zip the root build directory
zipDirectory(buildPath, zipPath);
