# Actions and Filters

This file documents all available hooks in this plugin, including the name it was previously known as if ported over from the core WPGraphQL plugin.

-> [Original documentation](https://www.wpgraphql.com/docs/customizing-wpgraphiql)

## PHP Actions

### wpgraphqlide_enqueue_script

Extensions looking to extend GraphiQL can hook in here, after the window object is established, but before the App renders.

## PHP Filters

### wpgraphqlide_context

The root context for the plugin.

### wpgraphqlide_external_fragments

...

### wpgraphqlide_capability_required

Filter the user capability required to use the GraphQL IDE. Defaults to `manage_options`.

## JavaScript Actions

### wpgraphqlide_rendered

Triggers a custom action 'wpgraphqlide_rendered' when the App component mounts, allowing plugins or themes to hook into this event. The action passes the current state of `drawerOpen` to any listeners, providing context about the application's UI state.

### wpgraphqlide_destroyed

This action can be utilized as a callback for any necessary cleanup or teardown operations in response to the App component's lifecycle.

## JavaScript Filters
