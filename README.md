# AI SDK v6 Crash Course

<img src="https://res.cloudinary.com/total-typescript/image/upload/v1770220978/ai-sdk-v5-crash-course-github-thumbnail_3x.jpg" alt="AI SDK 6 Crash Course" />

🚀 **Master AI SDK v6 with AI Hero's comprehensive crash course.** This repository contains all the code examples and exercises from our hands-on, practical course focused on AI SDK v6 - the incredible TypeScript library that's becoming the standard for AI app development.

Learn to build production-ready AI applications using AI SDK v6's powerful features and modern development patterns. Available on [aihero.dev](https://aihero.dev).

## 🎯 What You'll Master with AI SDK v6

This crash course will take you from AI SDK v6 basics to advanced production patterns:

- **AI SDK v6 Core Concepts** - Understanding the modern AI development toolkit
- **Streaming with AI SDK v6** - Building real-time, responsive AI experiences using `streamText`
- **Tool Calling & Function Calling** - Creating AI applications that can use external tools and APIs
- **Message Parts & Data** - Working with structured message components and custom data
- **Multi-Provider Support** - Seamlessly switching between OpenAI, Anthropic, Google, and more
- **File & Image Handling** - Processing and working with multimedia content
- **Advanced Memory Patterns** - Sophisticated state management and conversation handling
- **Production-Ready Features** - Built-in testing, monitoring, and deployment capabilities

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/en/download) (version 22 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn/bun
- API keys for your preferred AI providers:
  - [OpenAI](https://platform.openai.com/api-keys) (GPT-4, GPT-3.5)
  - [Anthropic](https://console.anthropic.com/) (Claude)
  - [Google AI Studio](https://aistudio.google.com/apikey) (Gemini)

### Setup

1. **Clone this repository:**

```bash
git clone https://github.com/ai-hero-dev/ai-sdk-v5-crash-course.git
cd ai-sdk-v5-crash-course
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Configure your environment:**

```bash
cp .env.example .env
```

4. **Add your API keys to `.env`** and you're ready to start learning!

## 📚 Course Structure

Start by running `pnpm dev`:

```bash
pnpm dev
```

This will allow you to choose between the different course sections.

You can also run `pnpm exercise <exercise-number>` to jump to a specific exercise.

## 📁 AI SDK v6 Course Modules

```
exercises/
├── 01-basics/                    # AI SDK v6 fundamentals
│   ├── 01.1-what-is-the-ai-sdk/
│   ├── 01.2-choosing-a-model/
│   ├── 01.3-stream-text-to-terminal/
│   ├── 01.4-ui-message-streams/
│   ├── 01.5-stream-text-to-ui/
│   └── 01.6-system-prompts/
├── 02-agents/                    # Tool calling & agents
├── 03-advanced/                  # Advanced patterns
└── 99-reference/                 # Material reference
```

## 🛠️ Learning Workflow

Each exercise follows this learning structure:

### `problem/` folder

- **Your coding playground** - Start here!
- Contains `readme.md` with detailed instructions
- Code files with `TODO` comments for you to implement

### `solution/` folder

- **Reference implementation** - Check when you're stuck
- Complete, working code for each exercise
- Great for comparing approaches and learning best practices

### `explainer/` folder

- **Deep dives** - Additional explanations and concepts
- Extended walkthroughs of complex topics
- Perfect for reinforcing your understanding

## 🤝 Getting Help

1. **Check the solution** - Each exercise has a completed version
2. **Verify your setup** - Ensure API keys and dependencies are correct
3. **Watch the course** - Full explanations available on [aihero.dev](https://aihero.dev)

Ready to master AI SDK v6 and become an AI development expert? Let's start building the future! 🚀
