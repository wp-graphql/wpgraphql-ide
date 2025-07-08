# AI Assistant Panel for WPGraphQL IDE

## Overview

This plugin integrates an AI assistant into the WPGraphQL IDE to provide contextual query assistance. The assistant leverages Google's Gemini API to analyze GraphQL schemas and provide relevant suggestions.

## Functionality

The assistant provides the following capabilities:
- Query analysis and error detection
- Schema-aware field suggestions
- Natural language query interpretation
- Performance optimization recommendations
- Error message clarification

## Installation

### Prerequisites
- WPGraphQL IDE
- Google Gemini API key

### Configuration

1. Obtain API key via one of the following methods:
   - Google AI Studio: https://makersuite.google.com/app/apikey
   - Google Cloud Console: Enable Generative Language API and create credentials

2. Configure the plugin:
   - Navigate to GraphQL → Settings → AI Assistant
   - Enter the API key
   - Save configuration

3. Access the assistant via the AI icon in the GraphiQL activity bar.

## Usage

Query the assistant with natural language requests. Examples:
- Query structure: "Query posts with featured images"
- Error resolution: "Explain error: [error message]"
- Optimization: "Optimize query for performance"

## Technical Implementation

### Architecture
```
ai-assistant-panel/
├── ai-assistant-panel.php    # REST API endpoint
├── src/
│   └── components/          # React components
└── build/                   # Compiled assets
```

### Build Process
```bash
npm run build    # Production build
npm start        # Development mode
```

## License

GPL v3 or later
