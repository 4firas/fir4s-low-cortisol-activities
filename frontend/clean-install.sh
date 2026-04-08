#!/bin/bash
set -e

echo "Removing node_modules and .next cache..."
rm -rf node_modules .next pnpm-lock.yaml

echo "Reinstalling dependencies..."
pnpm install

echo "Clean install complete!"
