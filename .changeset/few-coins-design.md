---
"wpgraphql-ide": major
---

Refactored stores, including renaming 'wpgraphql-ide' to 'wpgraphql-ide/app', and adding additional stores such as 'wpgraphql-ide/editor-toolbar.

Added `registerDocumentEditorToolbarButton` function to public API.

This function allows registering a new editor toolbar button with the following parameters:

- `name` (string): The name of the button to register.
- `config` (Object): The configuration object for the button.
- `priority` (number, optional): The priority for the button, with lower numbers meaning higher priority. Default is 10.

Example usage:

```js
const { registerDocumentEditorToolbarButton } = window;

registerDocumentEditorToolbarButton( 'toggle-auth', toggleAuthButton, 1 );
```
