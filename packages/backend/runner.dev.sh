#!/bin/sh

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    bun install
fi

# Start development server
bun run dev
