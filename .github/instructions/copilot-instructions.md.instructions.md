---
applyTo: "**"
---

# Project general coding guidelines

## Code Style

- When writing functions, always use function declarations like `function myFunc() {}`.

## Naming Conventions

- Use kebab casing for file names inside actions, components, lib, and hooks

## Code Quality

- Use meaningful variable and function names that clearly describe their purpose
- Include helpful comments for complex logic
- Add error handling for user inputs, server actions and API calls

## Terminal

- Never run database migrations (e.g., `prisma migrate`) in the terminal.
- Never drop, reset, or alter the database schema directly.
