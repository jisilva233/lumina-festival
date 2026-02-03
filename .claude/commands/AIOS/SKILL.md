---
name: aios
description: "Interact with AIOS (Synkra AI Operating System) - Universal AI Agent Framework"
invocation: "Start with /aios followed by a command"
when-to-invoke: "When the user wants to use AIOS commands like init, install, update, doctor, etc."
---

# AIOS CLI Integration

This skill provides access to AIOS (Synkra AI Operating System) commands within Claude Code.

## Available Commands

- **init**: Create a new AIOS project
- **install**: Install/configure AIOS in existing directory
- **update**: Upgrade to latest AIOS version
- **doctor**: Run system diagnostics
- **info**: Show system information
- **uninstall**: Remove AIOS from system

## Usage

Execute the AIOS command: `aios-core $ARGUMENTS`

For example:
- `/aios init my-project` → `aios-core init my-project`
- `/aios install --template default` → `aios-core install --template default`
- `/aios doctor --fix` → `aios-core doctor --fix`
- `/aios --version` → `aios-core --version`

## Instructions

When the user invokes this skill with arguments:
1. Parse the command and arguments from $ARGUMENTS
2. Execute the appropriate aios-core command
3. Display the output to the user
4. If the command requires additional setup or configuration, guide the user through the next steps
