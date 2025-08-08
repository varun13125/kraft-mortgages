## kraft-mortgages Code Style Guidelines

### General
- Use TypeScript for all new code
- Follow Next.js conventions and best practices
- Keep components small and focused
- Use functional components with React Hooks

### Imports
- Group imports in this order: React, Next.js, external libraries, internal modules
- Use absolute imports for all project files
- Sort imports alphabetically within each group

### Formatting
- Use single quotes for strings
- Use 2 spaces for indentation
- Add semicolons at the end of statements
- Use trailing commas in multiline structures

### Types
- Prefer TypeScript interfaces over types
- Define interfaces in a separate file if used across multiple components
- Use union types for function parameters that can accept multiple types

### Naming Conventions
- Use PascalCase for component names and interface names
- Use camelCase for variables, functions, and constants
- Use UPPER_CASE for environment variables and constants

### Error Handling
- Use try/catch blocks for asynchronous operations
- Create custom error classes for specific error types
- Provide meaningful error messages

### Build/Lint/Test Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`
- Run a single test: `npm run test -- path/to/test/file`