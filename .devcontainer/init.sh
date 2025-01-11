#!/bin/bash

# Initialize shadcn/ui
cd frontend
npx shadcn-ui@latest init

# Install required shadcn/ui components
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge

# Install additional dependencies
npm install lucide-react

# Return to root directory
cd ..