#!/usr/bin/env node

/**
 * Codex CLI Integration for AIOS
 *
 * Integrates OpenAI's Codex CLI with the AIOS framework
 * Provides unified interface for agents to use Codex as alternative AI assistant
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class CodexIntegration {
  constructor() {
    this.config = {
      version: '1.0.0',
      mode: 'cli',
      features: ['code-generation', 'debugging', 'optimization', 'documentation'],
    };
  }

  /**
   * Verify Codex CLI is installed
   */
  checkInstallation() {
    try {
      const version = execSync('codex --version', { encoding: 'utf-8' }).trim();
      console.log(`✓ Codex CLI found: ${version}`);
      return { installed: true, version };
    } catch (error) {
      console.error('✗ Codex CLI not found. Install with: npm install -g @openai/codex');
      return { installed: false };
    }
  }

  /**
   * List available Codex commands
   */
  listCommands() {
    try {
      const help = execSync('codex --help', { encoding: 'utf-8' });
      console.log(help);
    } catch (error) {
      console.error('Error fetching Codex help:', error.message);
    }
  }

  /**
   * Generate code using Codex
   * @param {string} prompt - Description of code to generate
   * @param {object} options - Generation options
   */
  generateCode(prompt, options = {}) {
    try {
      const args = [
        'codex',
        'generate',
        `--prompt="${prompt}"`,
        options.language ? `--language=${options.language}` : '',
        options.maxTokens ? `--max-tokens=${options.maxTokens}` : '',
      ].filter(Boolean).join(' ');

      const result = execSync(args, { encoding: 'utf-8' });
      return { success: true, code: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze code with Codex
   * @param {string} code - Code to analyze
   * @param {string} analysisType - Type of analysis
   */
  analyzeCode(code, analysisType = 'general') {
    try {
      // Save code to temp file
      const tempFile = path.join(process.tmpdir(), 'codex-analysis.js');
      fs.writeFileSync(tempFile, code);

      const args = [
        'codex',
        'analyze',
        tempFile,
        `--type=${analysisType}`,
      ].join(' ');

      const result = execSync(args, { encoding: 'utf-8' });
      fs.unlinkSync(tempFile);
      return { success: true, analysis: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get Codex status for AIOS
   */
  getStatus() {
    const installation = this.checkInstallation();
    return {
      framework: 'AIOS',
      tool: 'Codex CLI',
      status: installation.installed ? 'READY' : 'NOT_INSTALLED',
      version: installation.version || 'N/A',
      features: this.config.features,
      availableCommands: [
        'generate - Generate code from description',
        'analyze - Analyze code for issues',
        'optimize - Optimize code performance',
        'document - Generate documentation',
      ],
    };
  }

  /**
   * Integration guide for agents
   */
  getIntegrationGuide() {
    return {
      title: 'Codex Integration Guide for AIOS',
      activated: true,
      forAgents: ['@dev', '@architect', '@qa', '@analyst'],
      useCases: {
        dev: [
          'Generate boilerplate code',
          'Refactor existing functions',
          'Debug complex issues',
          'Implement utility functions',
        ],
        architect: [
          'Analyze system design',
          'Suggest architectural patterns',
          'Review design decisions',
        ],
        qa: [
          'Generate test cases',
          'Analyze test coverage',
          'Review test quality',
        ],
        analyst: [
          'Analyze code complexity',
          'Generate documentation',
          'Suggest improvements',
        ],
      },
      commands: {
        'codex-generate': 'codex generate --prompt="description"',
        'codex-analyze': 'codex analyze {file}',
        'codex-optimize': 'codex optimize {file}',
        'codex-document': 'codex document {file}',
        'codex-status': 'Show Codex integration status',
      },
    };
  }
}

// CLI Interface
const integration = new CodexIntegration();

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'check':
    integration.checkInstallation();
    break;
  case 'help':
    integration.listCommands();
    break;
  case 'status':
    console.log(JSON.stringify(integration.getStatus(), null, 2));
    break;
  case 'guide':
    console.log(JSON.stringify(integration.getIntegrationGuide(), null, 2));
    break;
  case 'generate':
    console.log(integration.generateCode(args.join(' ')));
    break;
  case 'analyze':
    if (args.length > 0) {
      const code = fs.readFileSync(args[0], 'utf-8');
      console.log(integration.analyzeCode(code, args[1] || 'general'));
    }
    break;
  default:
    console.log('Codex CLI Integration v1.0.0');
    console.log('\nCommands:');
    console.log('  check   - Check if Codex is installed');
    console.log('  help    - Show Codex help');
    console.log('  status  - Show integration status');
    console.log('  guide   - Show integration guide');
    console.log('  generate <prompt> - Generate code');
    console.log('  analyze <file> [type] - Analyze code');
}

module.exports = CodexIntegration;
