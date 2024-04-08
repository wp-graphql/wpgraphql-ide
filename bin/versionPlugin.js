#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('node:path');

/**
 * The main function to orchestrate version updates for the wpgraphql-ide plugin.
 * It updates the plugin's main file header, the stable tag in readme.txt, the version constant,
 * and the changelog section within readme.txt based on the latest entries from CHANGELOG.md.
 */
async function versionPlugin() {
  const pluginPath = path.join(__dirname, '../');
  const pluginFile = path.join(pluginPath, 'wpgraphql-ide.php');
  const readmeTxt = path.join(pluginPath, 'readme.txt');
  const changelogFile = path.join(pluginPath, 'CHANGELOG.md');

  const version = await getNewVersion(pluginPath);

  if (version) {
    await bumpPluginHeader(pluginFile, version);
    await bumpStableTag(readmeTxt, version);
    await bumpVersionConstant(pluginFile, version);
    await updateReadmeChangelog(readmeTxt, changelogFile, version);
  }
}

/**
 * Reads the new version number from the plugin's package.json file.
 * @param {string} pluginPath - The filesystem path to the plugin's root directory.
 * @returns {Promise<string>} The version number as a string.
 */
async function getNewVersion(pluginPath) {
  const packageJsonFile = path.join(pluginPath, 'package.json');
  const packageJson = await fs.readFile(packageJsonFile, { encoding: 'utf8' });
  return JSON.parse(packageJson).version;
}

/**
 * Updates the version number in the plugin's main PHP file header.
 * @param {string} pluginFile - The filesystem path to the plugin's main PHP file.
 * @param {string} version - The new version number.
 */
async function bumpPluginHeader(pluginFile, version) {
  return bumpVersion(pluginFile, /^\s*\*\s*Version:\s*([0-9.]+)$/gm, version);
}

/**
 * Updates the stable tag in the plugin's readme.txt file.
 * @param {string} readmeTxt - The filesystem path to the plugin's readme.txt file.
 * @param {string} version - The new version number.
 */
async function bumpStableTag(readmeTxt, version) {
  return bumpVersion(readmeTxt, /^Stable tag:\s*([0-9.]+)$/gm, version);
}

/**
 * Updates the version constant within the plugin's main PHP file.
 * @param {string} pluginFile - The filesystem path to the plugin's main PHP file.
 * @param {string} version - The new version number.
 */
async function bumpVersionConstant(pluginFile, version) {
  return bumpVersion(pluginFile, /^\s*define\(\s*'WPGRAPHQL_IDE_VERSION',\s*'([0-9.]+)'\s*\);/m, version);
}

/**
 * A utility function to replace a version number in a file based on a regex pattern.
 * @param {string} file - The filesystem path to the file being updated.
 * @param {RegExp} regex - A regular expression to match the current version number.
 * @param {string} version - The new version number to be inserted.
 */
async function bumpVersion(file, regex, version) {
  let data = await fs.readFile(file, { encoding: 'utf8' });
  const matches = regex.exec(data);

  if (!matches) {
    throw new Error(`Version string does not exist in ${file}`);
  }

  const versionString = matches[0].replace(matches[1], version);
  data = data.replace(matches[0], versionString);

  await fs.writeFile(file, data);
}

/**
 * Reads the CHANGELOG.md and updates the readme.txt changelog section with the latest version changes.
 * @param {string} readmeTxt - The filesystem path to the plugin's readme.txt file.
 * @param {string} changelogFile - The filesystem path to the plugin's CHANGELOG.md file.
 * @param {string} version - The new version number whose changelog entries are to be updated in readme.txt.
 */
async function updateReadmeChangelog(readmeTxt, changelogFile, version) {
  let readmeTxtData = await fs.readFile(readmeTxt, { encoding: 'utf8' });
  const changelog = await fs.readFile(changelogFile, { encoding: 'utf8' });

  const newChangelogPart = extractNewChangelogPart(changelog, version);
  readmeTxtData = insertChangelogIntoReadme(readmeTxtData, newChangelogPart);

  await fs.writeFile(readmeTxt, readmeTxtData);
}

/**
 * Extracts changelog entries for a specific version from CHANGELOG.md.
 * @param {string} changelog - The full content of CHANGELOG.md.
 * @param {string} version - The version number whose changelog entries are to be extracted.
 * @returns {string} The formatted changelog entries for the specified version.
 */
function extractNewChangelogPart(changelog, version) {
  const versionRegex = new RegExp(`## ${version}([\\s\\S]*?)(?=## \\[|$)`, 'gm');
  const matches = versionRegex.exec(changelog);

  if (matches && matches[1]) {
    return `= ${version} =\n${matches[1].trim()}\n`;
  } else {
    return `= ${version} =\nNo changelog entry found for this version.\n`;
  }
}

/**
 * Inserts the latest version changelog entries into the readme.txt file.
 * @param {string} readmeTxt - The current content of readme.txt.
 * @param {string} changelog - The new changelog entries to be inserted.
 * @returns {string} The updated content of readme.txt with the new changelog entries.
 */
function insertChangelogIntoReadme(readmeTxt, changelog) {
  const changelogSectionRegex = /== Changelog ==[\s\S]*== Frequently Asked Questions ==/;
  return readmeTxt.replace(changelogSectionRegex, `== Changelog ==\n\n${changelog}== Frequently Asked Questions ==`);
}

// Execute the main function to start the versioning process.
versionPlugin();
