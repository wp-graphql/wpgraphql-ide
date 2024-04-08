#!/usr/bin/env node

/**
 * Versions a WordPress plugin.
 *
 * Ported over from FaustJS
 * @link https://github.com/wpengine/faustjs/blob/canary/scripts/versionPlugin.js
 */
const fs = require("fs/promises");
const path = require("node:path");

/**
 * Reads the content of a file.
 * @param {string} filename - The path to the file to be read.
 * @returns {Promise<string>} The content of the file.
 */
const readFile = (filename) => fs.readFile(filename, { encoding: "utf8" });

/**
 * Writes content to a file.
 * @param {string} file - The path to the file where content will be written.
 * @param {string} data - The content to write to the file.
 * @returns {Promise<void>}
 */
const writeFile = fs.writeFile;

/**
 * Executes versioning operations for the WordPress plugin including updating
 * the version in various files and generating a changelog in the readme.txt.
 */
async function versionPlugin() {
  const pluginPath = path.join(__dirname, "../");
  const pluginFile = path.join(pluginPath, "wpgraphql-ide.php");
  const readmeTxt = path.join(pluginPath, "readme.txt");
  const changelog = path.join(pluginPath, "CHANGELOG.md");

  const version = await getNewVersion(pluginPath);

  if (version) {
    await bumpPluginHeader(pluginFile, version);
    await bumpStableTag(readmeTxt, version);
    await bumpVersionConstant(pluginFile, version);
    await generateReadmeChangelog(readmeTxt, changelog);
  }
}

/**
 * Updates the version number in the plugin's PHP header.
 * @param {string} pluginFile - Path to the plugin's main PHP file.
 * @param {string} version - New version number.
 */
async function bumpPluginHeader(pluginFile, version) {
  return bumpVersion(pluginFile, /^\s*\*\s*Version:\s*([0-9.]+)$/gm, version);
}

/**
 * Updates the stable tag in the plugin's readme.txt.
 * @param {string} readmeTxt - Path to the readme.txt file.
 * @param {string} version - New version number.
 */
async function bumpStableTag(readmeTxt, version) {
  return bumpVersion(readmeTxt, /^Stable tag:\s*([0-9.]+)$/gm, version);
}

/**
 * Updates the version constant within the plugin.
 * @param {string} pluginFile - Path to the plugin's main PHP file.
 * @param {string} version - New version number.
 */
async function bumpVersionConstant(pluginFile, version) {
  return bumpVersion(
    pluginFile,
    /^\s*define\(\s*'WPGRAPHQL_IDE_VERSION',\s*'([0-9.]+)'\s*\);/,
    version
  );
}

/**
 * Replaces a version number within a file based on a regular expression match.
 * @param {string} file - Path to the file to be updated.
 * @param {RegExp} regex - Regular expression to match the current version string.
 * @param {string} version - New version number to replace the old version.
 */
async function bumpVersion(file, regex, version) {
  try {
    let data = await readFile(file);
    const matches = regex.exec(data);

    if (!matches) {
      throw new Error(`Version string does not exist in ${file}`);
    }

    let versionString = matches[0].replace(matches[1], version);
    data = data.replace(matches[0], versionString);

    return writeFile(file, data);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Retrieves the current version number from the plugin's package.json file.
 * @param {string} pluginPath - Path to the directory containing package.json.
 * @returns {Promise<string>} The current version number.
 */
async function getNewVersion(pluginPath) {
  const packageJsonFile = path.join(pluginPath, "package.json");

  try {
    let packageJson = await readFile(packageJsonFile);
    return JSON.parse(packageJson)?.version;
  } catch (e) {
    if (e instanceof SyntaxError) {
      e.message = `${e.message} in ${packageJsonFile}.\n`;
    }

    console.warn(e);
  }
}

/**
 * Generates or updates the changelog section in the plugin's readme.txt.
 * @param {string} readmeTxtFile - Path to the readme.txt file.
 * @param {string} changelog - Path to the CHANGELOG.md file.
 */
async function generateReadmeChangelog(readmeTxtFile, changelog) {
  let output = "";

  try {
    let readmeTxt = await readFile(readmeTxtFile);
    changelog = await readFile(changelog);

    // Custom logic to format and insert changelog entries into readme.txt
    // Assumes specific formatting of the CHANGELOG.md

    const changelogStart = readmeTxt.indexOf("== Changelog ==");

    output = readmeTxt.substring(0, changelogStart) + changelog;
    output +=
      "\n[View the full changelog](https://github.com/wp-graphql/wpgraphql-ide/blob/main/CHANGELOG.md)";

    return writeFile(readmeTxtFile, output);
  } catch (e) {
    console.warn(e);
  }
}

versionPlugin();
