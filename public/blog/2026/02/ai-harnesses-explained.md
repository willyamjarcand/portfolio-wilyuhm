# AI Harnesses: The Layer That Makes Agents Actually Work

Most people who interact with AI think they're talking to "the model." They type a message, get a response, and assume the intelligence comes entirely from the LLM underneath. That's like assuming the engine is the entire car.

The missing piece is what the industry calls a harness.

## What's a Harness?

An AI harness — also called scaffolding or an agentic framework — is the software layer that wraps around a model and turns it from a text predictor into something that can actually do things.

A raw LLM can only do one thing: given text, predict what comes next. It can't read your files. It can't run code. It can't remember what you told it yesterday. All of that comes from the harness.

The model is the brain. The harness is everything else — the nervous system, the sensory organs, the hands.

A harness gives a model three things it doesn't have on its own:

- **Tools** — the ability to interact with the outside world: read files, run shell commands, call APIs, search the web.
- **Context management** — control over what the model sees and when. LLMs have finite context windows, so the harness decides what to include, what to summarize, and what to load on demand.
- **An execution loop** — the logic that turns a single Q&A into a multi-step workflow. Plan, act, check the result, decide what to do next. This is the difference between a chatbot and an agent.

## Claude Code as a Case Study

Claude Code is a good example of how much the harness matters.

The same Claude Sonnet model powering a conversation in your browser is the one running inside Claude Code. But the experience is completely different, because the harness is completely different.

Ask both `claude.ai` and Claude Code to find and fix a bug in your auth middleware. The web interface will ask you to paste the relevant code, tell you what's wrong, and write a fix — which you then copy, paste, and test yourself. Claude Code will grep your codebase to find the file, read it and its dependencies, fix it, run your test suite, read the failure output if it breaks, and loop until it passes.

Same model. Completely different capability. The harness is the equipment.

## The Agentic Loop

At the core of Claude Code's harness is the agentic loop. Every task runs through three phases:

**Gather context** — Claude searches your project, reads relevant files, and builds its own understanding. No manual indexing or file uploads.

**Take action** — It edits files, runs commands, installs packages — whatever the task requires. Each action is a tool call routed to your local system.

**Verify** — It runs tests, reads build output, checks logs. If something fails, it loops back and tries again.

The key thing: Claude decides what each step requires based on what the previous step returned. A simple task might only touch the first phase once. A complex refactor might cycle through all three a dozen times. That adaptive loop is what makes it an agent rather than a fancy autocomplete.

## Tools Are the Agent's Hands

Claude Code ships with built-in tools across five categories:

- **File reading** — `Glob`, `Grep`, `Read` for navigating codebases
- **File writing** — `Write` and `Edit` for making changes
- **Execution** — `Bash`, which means anything you can do from a terminal, Claude can do: run tests, use git, install packages, curl APIs
- **Search** — for reaching outside your local filesystem
- **Orchestration** — for spawning sub-agents and managing complex tasks

Every tool call returns output that feeds back into the loop. A failing test becomes context for the next decision. That feedback is what makes the system agentic rather than scripted.

## Sub-Agents: Delegation

Claude Code supports spawning sub-agents — separate instances of Claude running in their own isolated context windows.

This is useful for two reasons.

**Context management.** A large task can fill up the main agent's context window fast. Delegating a specific subtask (like "audit this file for security issues") to a sub-agent keeps the main context clean. The sub-agent works, produces a summary, and returns just the relevant findings.

**Parallelism.** Need to research best practices, document existing behavior, and write tests for a new implementation? Three sub-agents, running simultaneously.

Claude Code ships with a few built-in sub-agent types — one optimized for read-only codebase exploration, one with the full tool set — and you can define your own with specific tool access and behavioral instructions.

## Skills: Teaching the Agent How to Work

If sub-agents are about delegation, skills are about behavior. A skill is a markdown file that tells Claude how to approach a specific type of task.

Each skill has a name, a description, and a body of instructions. Claude doesn't load all skills upfront — it sees only the names and descriptions, and loads the full instructions on demand when they match what you're asking for. It's lazy loading for AI behavior.

You can also combine skills with sub-agents: a skill marked to run in isolation spawns a sub-agent, uses the skill's content as its task prompt, and returns a summary to the main conversation. Good for "do a deep research pass on this topic" without polluting your main context.

## The Rest of the Ecosystem

A few more extension points worth knowing:

**CLAUDE.md** — a markdown file loaded at the start of every session. Persistent memory. The right place for short, always-true conventions: "use tabs not spaces," "run lint before committing."

**Hooks** — event-driven automation triggered by moments in the loop. Desktop notification when Claude finishes a task. Custom validation before a file gets written. That sort of thing.

**MCP (Model Context Protocol)** — an open standard for connecting agents to external services. GitHub, databases, Slack — anything that implements the protocol becomes a tool.

**Plugins** — installable bundles that package skills, sub-agents, hooks, and MCP servers together. One install, multiple capabilities.

## Why This Matters

When Claude Code successfully refactors a codebase across dozens of files, runs tests after each change, and iterates until everything passes — that's not just the model being smart. The model provides the reasoning. The harness provides the ability to read the code, write the changes, run the tests, read the results, and loop.

The same model can feel dramatically different in different products because the harness is different. Claude in a chat interface, Claude in an IDE, Claude in a terminal agent — same brain, different body.

As models get more capable, the harness matters more, not less. A smarter model benefits more from better tools and better orchestration — just like a better driver benefits more from a better car.

The harness is the car. And it's most of what you're actually using.
