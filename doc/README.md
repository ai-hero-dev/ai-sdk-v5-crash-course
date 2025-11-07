# AI SDK V5 Documentation

Complete knowledge base for building agents and LLM applications using AI SDK V5.

## Documentation Structure

This documentation is organized into three complementary guides:

### 1. [AI SDK V5 Complete Guide](./AI-SDK-V5-Complete-Guide.md)
**The comprehensive reference - start here!**

- Complete coverage of all AI SDK V5 features
- Core concepts and fundamentals
- Detailed explanations with examples
- Best practices throughout
- Perfect for learning from scratch or as a complete reference

**Topics covered:**
- Installation & Setup
- Core Functions (generateText, streamText, streamObject)
- Providers & Models
- Streaming (text, objects, UI messages)
- Tool Calling & Agents
- Message System (UIMessage, ModelMessage, parts)
- Working with Images and Files
- Persistence
- Advanced Workflows
- Context Engineering (Prompting)
- Custom Data Streaming
- Error Handling
- Evals & Testing
- LLM Fundamentals (tokens, usage, context window)
- Best Practices
- Complete Examples

### 2. [Advanced Patterns](./Advanced-Patterns.md)
**Production-ready patterns for sophisticated applications**

Advanced techniques for building robust, production-grade AI applications:

- **Guardrails**: Protect your application from inappropriate queries
- **Model Routers**: Optimize costs by routing queries to appropriate models
- **MCP (Model Context Protocol)**: Integrate pre-built tool servers
- **Breaking Agent Loops Early**: Control when agent loops terminate
- **Comparing Multiple Outputs**: Generate and select the best response
- **Message Metadata**: Track performance and display information
- **Custom Stream Parts**: Create rich UI experiences

### 3. [Quick Reference](./Quick-Reference.md)
**Fast lookup for common operations**

A cheat sheet for quick reference:

- Common imports
- Basic operations
- API patterns
- Code snippets
- Debugging tips
- Common errors and solutions

## How to Use This Documentation

### For Beginners
1. Start with [AI SDK V5 Complete Guide](./AI-SDK-V5-Complete-Guide.md)
2. Read sections in order, following the examples
3. Use [Quick Reference](./Quick-Reference.md) as you build

### For Experienced Developers
1. Skim [AI SDK V5 Complete Guide](./AI-SDK-V5-Complete-Guide.md) for overview
2. Jump to specific sections as needed
3. Explore [Advanced Patterns](./Advanced-Patterns.md) for production patterns
4. Keep [Quick Reference](./Quick-Reference.md) handy

### For Cursor/Claude as Knowledge
All three documents are designed to be used as knowledge sources for AI coding assistants:

- Comprehensive coverage of AI SDK V5
- Practical examples for every concept
- Best practices integrated throughout
- Copy-paste ready code snippets
- Clear section structure for easy navigation

## What's Covered

This documentation provides complete knowledge of:

### Core Functionality
- Text generation (streaming and non-streaming)
- Structured output generation
- Multi-provider support (OpenAI, Anthropic, Google)
- Model selection and configuration

### Agent Development
- Tool calling and function execution
- Multi-step workflows
- Agent loop control
- Custom tools and integrations

### UI Integration
- React hooks (useChat)
- Message streaming to frontend
- File and image handling
- Custom data streaming

### Production Features
- Conversation persistence
- Error handling and retries
- Usage tracking and cost optimization
- Guardrails and safety
- Model routing
- Testing with evals

### Advanced Techniques
- Custom workflows
- Research agents with web search
- Prompt engineering templates
- Context engineering
- LLM fundamentals (tokens, context windows)
- MCP integration

## Based On

This documentation is synthesized from:

1. **AI SDK V5 Crash Course** repository exercises and examples
2. Official Vercel AI SDK documentation and best practices
3. Real-world patterns from production applications

## Quick Start

```bash
# Install dependencies
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google zod

# Create .env file
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_GENERATIVE_AI_API_KEY=your_key

# Start building!
```

See the [Quick Reference](./Quick-Reference.md) for common code patterns.

## Examples

Every concept includes working code examples:

- ✅ Simple text generation
- ✅ Streaming responses
- ✅ Structured output (JSON)
- ✅ Tool calling / agents
- ✅ Multi-step workflows
- ✅ Frontend integration
- ✅ Persistence
- ✅ Advanced patterns

## Contributing

Found an error or want to add something? This documentation is derived from the [AI SDK V5 Crash Course](https://aihero.dev) repository.

## Resources

- **Official AI SDK Docs**: https://ai-sdk.dev
- **GitHub Repository**: https://github.com/vercel/ai
- **AI SDK V5 Course**: https://aihero.dev
- **Model Context Protocol**: https://modelcontextprotocol.io

---

**Ready to build?** Start with the [Complete Guide](./AI-SDK-V5-Complete-Guide.md)!
