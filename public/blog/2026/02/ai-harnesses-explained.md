# AI Harnesses: The Layer That Makes Agents Actually Work

There's a misconception I keep running into: people think when they use Claude Code or Copilot or whatever, they're basically just talking to a model with a nicer UI. The model is the product. Everything else is decoration.

That's not really how it works.

## The model can't do much on its own

A raw LLM does one thing. Given some text, predict what comes next. That's it. It can't read your files. It can't run your tests. It has no idea what you told it last Tuesday. On its own, it's genuinely not that useful.

What makes these tools actually work is the layer sitting on top of the model, usually called a harness (or scaffolding, or agentic framework, the naming isn't consistent). The harness is what gives the model eyes, hands, and memory.

Three things specifically:

- **Tools:** file reads, shell execution, API calls, web search. Without these, the model can only produce text. With them, it can actually do things.
- **Context management:** models have a finite context window, so something has to decide what goes in it. The harness handles that: what to load, what to summarize, what to fetch on demand.
- **An execution loop:** instead of one prompt, one response, the harness lets the model plan, act, check what happened, and decide what to do next. That's the difference between a chatbot and an agent.

## Claude Code is a good example

I've been using Claude Code a lot lately, and it makes the model vs. harness distinction really obvious.

The Claude Sonnet model in my terminal is the exact same model as the one in the claude.ai chat. Same weights, same training. But the experience is completely different.

Ask the web interface to find a bug in your auth middleware and it'll ask you to paste the code, tell you what's wrong, and write a fix. Then you go copy it, drop it in the right file, run the tests, come back with the results. You're doing all the legwork.

Claude Code just... does it. Greps the codebase, finds the file, reads the dependencies, makes the edit, runs the tests, reads the failure if it breaks, adjusts, tries again. I've watched it loop through a fix four or five times on its own before getting it right.

Same model. The harness is doing the heavy lifting.

## The loop

The way Claude Code's harness actually works is a three-phase loop it runs through for every task:

**Gather context:** searches the project, reads relevant files, figures out what it's dealing with. No manual setup from me.

**Take action:** edits files, runs commands, whatever the task needs. Each action is a tool call the harness routes to my local system.

**Verify:** runs tests, reads output, checks if it worked. If it didn't, loops back.

What I find interesting is that Claude decides what each phase needs based on what came out of the last one. A simple task might go through once. A gnarly refactor might loop a dozen times. The harness is what makes that iteration possible at all.

## Tools

The built-in tool set is straightforward:

- `Glob`, `Grep`, `Read` for finding and reading files
- `Write` and `Edit` for making changes
- `Bash` for everything else (tests, git, package installs, whatever)

The `Bash` tool is the one that surprised me most when I first used it. It's not sandboxed in any interesting way, if you tell it to, it'll just run things. That's powerful and also why the permission model matters.

## Sub-agents

One thing I didn't expect: Claude Code can spawn other instances of itself to work on subtasks.

The main practical reason is context. Context windows fill up fast on big tasks (file contents, command outputs, back-and-forth). If I'm in the middle of a refactor and need Claude to also research something or review a separate file, spinning that off into a sub-agent keeps the main context from getting polluted. The sub-agent does its thing, summarizes the findings, and returns them.

The other reason is parallelism. Need to research something, write tests, and document a new feature? Three sub-agents, running at the same time.

You can define your own sub-agent types with custom tool access and instructions. I haven't gone deep on this yet but the primitives are there.

## Skills and everything else

Skills are markdown files that tell Claude how to approach specific types of tasks. The harness matches your request against available skill descriptions and loads the relevant instructions into context on demand. Lazy loading, basically. You can also run a skill in an isolated sub-agent so it doesn't touch your main context at all.

A few other things in the ecosystem worth knowing:

**CLAUDE.md** sits at your project root and gets loaded every session. I use it for the stuff that's always true: which test command to run, conventions I don't want to repeat, that sort of thing.

**Hooks** are event triggers you can attach to specific moments in the loop. I have one that pings me when Claude's waiting on input.

**MCP** (Model Context Protocol) is an open standard for connecting the agent to external services. GitHub, Slack, databases, anything that implements it becomes a tool Claude can use.

**Plugins** bundle all of the above into installable packages. Install one, get a whole set of skills, sub-agents, and MCP connections.

## Why I care about this distinction

Honestly I think a lot of the "AI is overhyped" takes come from people who've only used the raw model. A chat interface with a smart model is useful but limited. The same model wrapped in a well-built harness that can read your codebase, run your tests, and iterate on failures is a different thing entirely.

The harness is most of the product. The model is what makes it work.
