Okay, now you know what we're learning, let's actually look at how you're going to learn it. All of the interactive stuff you're going to do in this course is going to be done inside a GitHub repo.

## Setting Up the GitHub Repository

So your first job is to clone the [repo](https://github.com/ai-hero-dev/ai-sdk-v5-crash-course) down:

```bash
git clone https://github.com/ai-hero-dev/ai-sdk-v5-crash-course.git
cd ai-sdk-v5-crash-course
```

Next, let's install the dependencies via `pnpm install`:

```bash
pnpm install
```

If you don't have PNPM installed, install it first via [this link](https://pnpm.io/installation).

Next, let's copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

## Running Exercises

Finally, let me show you how to run an exercise. You go into the terminal and you run:

```bash
pnpm dev
```

Check out the video above for a demo for what gets shown.

## Troubleshooting

If you encounter any issues with this setup, then I recommend you run:

```bash
pnpm dev --simple
```

This will give you a slightly more robust experience, which is useful when you're doing this from an unusual operating system.

Of course if you have any issues with this setup then let me know in the [Discord](https://aihero.dev/discord) and I will help you out.

## Taking the Course

The process for taking the course is to either watch the video or read the text below. Every single one of these exercise texts also has a steps to complete section at the bottom, which gives you a really clear step-by-step guide to follow.

Keep working through the exercises, and before you know it, you'll have mastered the AI SDK. And if you have any questions or queries or any confusions at all, then ping them into the Discord. That is what it's for.

Thanks so much for taking the course and I will see you in the next one.

## Steps To Complete

- [ ] Clone the GitHub repository to your local machine
  - Clone it locally using your preferred method
  - [Repo](https://github.com/ai-hero-dev/ai-sdk-v5-crash-course)

- [ ] Install dependencies by running `pnpm install`
  - If you don't have PNPM, install it first following [this link](https://pnpm.io/installation)

- [ ] Set up environment variables
  - Copy the `.env.example` file to `.env`
  - We'll configure API keys in the next lesson

- [ ] Test running an exercise with `pnpm dev`
  - Navigate the exercise menu using arrow keys or typing to search
  - Select an exercise to run

- [ ] If you have any setup issues, try running `pnpm dev --simple` for a more robust experience

- [ ] Join the [Discord](https://aihero.dev/discord) if you have any questions or need help
