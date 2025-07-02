# Changelog

## 4.0.6

### Patch Changes

- d1df1d4: chore: update tested WordPress version to 6.8

## 4.0.5

### Patch Changes

- c6cfbc1: fix: linting tooltips are now visible when using the IDE in the drawer
- 6500ef3: fix: broken query composer by adding missing import statements for AbstractArgView and FieldView components. Props to @hacknug for the fix!

## 4.0.4

### Patch Changes

- b4d7302: Test

## 4.0.3

### Patch Changes

- fd9d099: chore: set workflow environment

## 4.0.2

### Patch Changes

- a2b5fbd: - chore: Bump supported WordPress version

## 4.0.1

### Patch Changes

- 477a555: ### Added

  - Introduced `wp_localize_escaped_data()` function for recursively escaping data before localizing it in WordPress. This ensures safe output of strings, URLs, integers, and nested arrays when passing data to JavaScript, using native WordPress functions like `wp_kses_post()` and `esc_url()`.

  ### Improved

  - Enhanced security by ensuring all localized data is properly sanitized before being passed to `wp_localize_script()`, preventing potential XSS vulnerabilities and ensuring safe use of dynamic data in JavaScript.

- 4da3973: - chore: Bump the npm_and_yarn group across 1 directory with 7 updates

## 4.0.0

### Major Changes

- eda911d: Updated the plugin's custom filter and action names to be consistent across the plugin

### Patch Changes

- eda911d: Fixed bug where credentials were being sent in the headers unnecessarily under certain conditions

## 3.0.0

### Major Changes

- 7a07c0c: Change JavaScript hook names to have consistent prefix, and update codebase to meet WordPress.org standards.

## 2.1.5

### Patch Changes

- cb6eda0: Reorder sidebar menu to always have the IDE first.
- 1f50c93: Fixes issue where custom capability was not being assigned to the administrator role. This now happens on plugin activation.

## 2.1.4

### Patch Changes

- 8f6f131: Update license to GPL-3

## 2.1.3

### Patch Changes

- 66f7e28: - Remove npm workspaces and have webpack handle compiling of the main app and internal plugins.
- 43479e0: - Add settings link to the IDE Settings tab from the WordPress settings page.
- 1cfbdff: - **New Capability**: Introduced a new custom capability `manage_graphql_ide`. This capability allows administrators to control access to the WPGraphQL IDE functionalities. The capability has been assigned to the `administrator` role by default.

## 2.1.2

### Patch Changes

- f6745e9: - fix missing styles in latest release

## 2.1.1

### Patch Changes

- c450e5a: - Reorganized plugin directories/files.

## 2.1.0

### Minor Changes

- 6752c37: - Added new settings section to WPGraphQL, IDE Settings

  - Added new setting, Admin Bar Link Behavior

  ![WPGraphQL IDE Settings tab showing the admin bar link behavior and Show legacy editor settings](https://github.com/wp-graphql/wpgraphql-ide/assets/6676674/59236b4c-0019-40a8-ae9b-a1228997f30c)

## 2.0.0

### Major Changes

- 43eea79: Refactored stores, including renaming 'wpgraphql-ide' to 'wpgraphql-ide/app', and adding additional stores such as 'wpgraphql-ide/editor-toolbar.

  Added `registerDocumentEditorToolbarButton` function to public API.

  This function allows registering a new editor toolbar button with the following parameters:

  - `name` (string): The name of the button to register.
  - `config` (Object): The configuration object for the button.
  - `priority` (number, optional): The priority for the button, with lower numbers meaning higher priority. Default is 10.

  Example usage:

  ```js
  const { registerDocumentEditorToolbarButton } = window.WPGraphQLIDE;

  registerDocumentEditorToolbarButton("toggle-auth", toggleAuthButton, 1);
  ```

  ![Screenshot of the GraphiQL IDE highlighting the Toolbar buttons within the Document Editor region.](https://github.com/wp-graphql/wpgraphql-ide/assets/1260765/2395c3c8-1915-4a24-b64e-35ebe16e674f)

## 1.1.9

### Patch Changes

- 194821c: - fix: The IDE no longer waits on `DOMContentLoaded` in order to help client side performance with heavier pages.
  - add: New PHP filters for updating the drawer label:
    - `wpgraphqlide_drawer_button_label`
    - `wpgraphqlide_drawer_button_loading_label`
- f5130d9: docs: Remove link to community Slack on "Help Page" in favor of link community Discord (recently migrated)

## 1.1.8

### Patch Changes

- b005b0e: update tested up to version to WordPress 6.5

## 1.1.7

### Patch Changes

- 195dba9: fix: update z-index of the CodeMirror-info tooltip to show above the drawer

## 1.1.6

### Patch Changes

- b3164da: fix GitHub release upload

## 1.1.5

### Patch Changes

- 364b930: Fix release automation

## 1.1.4

### Patch Changes

- f0aaec1: automate github release upload

## 1.1.3

### Patch Changes

- 1f3d5b4: Fix automation of release artifact

## 1.1.3

### Patch Changes

- 3f6969a: Fix automation of release artifact

## 1.1.2

### Patch Changes

- 4660517: Fix automation of release artifact

## 1.1.1

### Patch Changes

- 45333ab: Fix automation of release artifact
- 6d73d1b: Fix automation of release artifact

## [1.1.0] - 2024-04-3

### Minor Changes

- 75ec916: Add help page as a built-in plugin

### Patch Changes

- c76d592: test
- e616aab: Added changesets to assist with releases

## [1.0.1] - 2024-01-22

### Fixed

- Fixed inability to select text inside of editor

### Added

- Focusable dismiss button to close the drawer

## [1.0.0] - 2023-11-22

### Added

- GraphiQL 3.\*
