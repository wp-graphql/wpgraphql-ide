---
"wpgraphql-ide": patch
---

- fix: The IDE no longer waits on `DOMContentLoaded` in order to help client side performance with heavier pages.
- add: New PHP filters for updating the drawer label:
  - `wpgraphqlide_drawer_button_label`
  - `wpgraphqlide_drawer_button_loading_label`
