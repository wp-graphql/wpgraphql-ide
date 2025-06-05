# AI Assistant Panel for WPGraphQL IDE

## 🚀 GraphQL Genius - Your Smart Query Companion

An AI-powered assistant that helps developers write better GraphQL queries by understanding their WordPress schema and providing contextual tips.

## Features

### 🤖 Real-time Query Analysis
- Analyzes your queries as you type
- Identifies potential issues (N+1 queries, missing fields, deprecated fields)
- Suggests better query structures

### 🧠 Schema-Aware Context
- Full understanding of your WordPress GraphQL schema
- Knows about custom post types, fields, and relationships
- Provides relevant field suggestions based on context

### 💬 Interactive Chat Interface
- Ask questions in plain language like "How do I query posts with their featured images?"
- Get instant, contextual responses
- Copy-paste ready code snippets with syntax highlighting

### ⚡ Query Optimization Tips
- Performance suggestions (use pagination, avoid deep nesting)
- Security best practices
- WordPress-specific optimizations

### 🐛 Error Diagnosis
- Understands GraphQL errors and provides fixes
- Explains error messages in plain language
- Suggests alternative approaches

## Setup

### 1. Get a Gemini API Key

#### Option A: Google AI Studio (Personal Accounts)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for the next step

**Note:** If you see "you do not have access to AI Studio", your Google account may be managed by an organization that restricts access. Try Option B below.

#### Option B: Google Cloud Console (Simple API Key)
This method uses the **Generative Language API** with a simple API key (same as Option A but through Cloud Console).

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **"Generative Language API"** (NOT Vertex AI)
4. Go to "APIs & Services" → "Credentials"
5. Create a new **API key**
6. Use this API key in the plugin settings

**Best for:** Development, testing, or when you need a simple API key like Option A but prefer using Cloud Console.

#### Option C: Vertex AI (Enterprise/Production)
This method uses **Vertex AI** with service account authentication (more complex but more powerful).

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project with **billing enabled** (required for Vertex AI)
3. Enable the **"Vertex AI API"** (different from Generative Language API)
4. Create a Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name it (e.g., "wpgraphql-ai-assistant")
   - Grant the role "Vertex AI User" or "Vertex AI Administrator"
5. Create and download credentials:
   - Click on your new service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose JSON format
   - Download the JSON key file
6. Set up authentication:
   - Option 1: Set environment variable `GOOGLE_APPLICATION_CREDENTIALS` to the path of your JSON key file
   - Option 2: Upload the JSON file to your WordPress server (secure location) and configure the path in the plugin

**Note:** Vertex AI requires billing to be enabled and has usage-based pricing. It's recommended for production use cases where you need enterprise features like:
- Better rate limits and quotas
- Data residency controls
- VPC Service Controls
- Audit logging
- Model monitoring

#### Option D: Use a Personal Google Account
If your work account is restricted, you can:
1. Sign out and use a personal Gmail account
2. Follow Option A above with your personal account
3. Use that API key in your WordPress installation

### 2. Configure the Plugin
1. Navigate to **GraphQL → Settings** in your WordPress admin
2. Click on the **AI Assistant** tab
3. Paste your Gemini API key
4. Save the settings

### 3. Start Using the Assistant
1. Open the GraphQL IDE
2. Click the AI Assistant icon in the activity bar (looks like stacked layers with sparkles)
3. Start chatting with your GraphQL assistant!

## Example Questions

- "How do I query posts with their featured images?"
- "Show me pagination best practices"
- "What's the difference between nodes and edges?"
- "How can I optimize this query?"
- "Explain this error: Cannot query field 'title' on type 'Post'"
- "How do I query custom post types?"
- "Show me how to use variables in my query"

## Technical Details

### API Integration
- Uses Google's Gemini Pro model for natural language processing
- Sends context including current query, variables, and schema
- Responses are cached client-side for performance

### Privacy & Security
- API requests are authenticated with WordPress nonce
- Only users with `manage_graphql_ide` capability can use the assistant
- Query context is sent to Gemini but not stored permanently

### Customization
The assistant's behavior can be customized by modifying the prompt in `ai-assistant-panel.php`:
- Adjust the temperature for more/less creative responses
- Modify the system prompt for different personalities
- Change the token limit for longer/shorter responses

## Development

### Building
The plugin is built using the root webpack configuration:
```bash
npm run build
```

### Development Mode
```bash
npm start
```

### File Structure
```
ai-assistant-panel/
├── ai-assistant-panel.php    # Main plugin file with REST API
├── src/
│   ├── ai-assistant-panel.js # Entry point
│   └── components/
│       ├── AIAssistantIcon.jsx
│       ├── AIAssistantPanel.jsx
│       └── AIAssistantPanel.css
└── build/                    # Generated files
```

## Future Enhancements

- **Alternative AI Providers**: Support for OpenAI GPT-4, Anthropic Claude, or open-source models
- **Streaming Responses**: Real-time streaming for better UX
- **Query History**: Remember and learn from past queries
- **Team Knowledge Sharing**: Share insights across team members
- **Voice Input**: Ask questions using voice
- **Query Templates**: Pre-built query templates for common use cases
- **Performance Benchmarking**: Compare query performance
- **Multi-language Support**: Support for other LLMs besides Gemini

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This plugin is licensed under the GPL v3 or later.
