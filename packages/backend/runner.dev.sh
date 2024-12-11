#!/bin/sh

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    bun install
fi

# Install nodemon if not already installed
if ! command -v bunx nodemon &> /dev/null; then
    bun add -d nodemon
fi

# Start development server with nodemon watching both ts files and config.yaml
bunx nodemon --watch 'src/**/*.ts' --watch 'src/**/*.yaml' --watch 'config.yaml' --exec 'bun run dev' -e ts,yaml
