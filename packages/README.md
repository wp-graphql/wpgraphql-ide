# WPGraphQL IDE Packages

This directory contains packages that are used to build the WPGraphQL IDE.

Each package has its own README.md file with more information about the package.

## Packages

### Activity Bar

The Activity Bar is the left-hand side of the IDE that contains the main navigation and utility links.

### Activity Panel

The Activity Panel is the area that is displayed to the right of the Activity Bar but to the left of the primary content area.

The activity panel is used to display the various panels that are used to interact with the IDE or other parts of the application, for example installing extension plugins.

### App

The App package is the main entry point for the WPGraphQL IDE. It is responsible for rendering the main layout of the IDE and managing general state of the application.

### Components

The Components package contains the various re-usable components that are focused on presentation and re-usability. These components are used within the other packages to build the WPGraphQL IDE.

### Document Editor

The Document Editor package is responsible for rendering the main content area of the IDE. It is used to display the various GraphQL Documents that are open in the IDE in a tabbed interface and allows for the documents to be created, updated, deleted and executed.

### Preferences

The Preferences package is responsible for managing the preferences of the WPGraphQL IDE. It is used to display the preferences panel and to manage the preferences of the IDE, such as the theme (light/dark, etc), font size, etc.

### Response Inpsector

The Response Inspector package is responsible for displaying the response from the server when a GraphQL operation is executed. It is used to display the response in a tabbed interface and allows for various parts of response (body, headers, debug info, etc) to be inspected and navigated.
