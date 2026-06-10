const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:', 'Users', 'raish', 'Desktop', 'Project', 'IncidentIQ', 'Project', 'frontend', 'src');

const replacements = [
  // Remove dark: variants of these if they exist (we will replace the base classes with theme variables)
  { pattern: /\bdark:bg-slate-[0-9]+\/?([0-9]+)?\b/g, replacement: '' },
  { pattern: /\bdark:text-slate-[0-9]+\b/g, replacement: '' },
  { pattern: /\bdark:border-slate-[0-9]+\/?([0-9]+)?\b/g, replacement: '' },
  { pattern: /\bdark:text-white\b/g, replacement: '' },
  { pattern: /\bdark:bg-\[\#[a-fA-F0-9]+\]\/?([0-9]+)?\b/g, replacement: '' },
  { pattern: /\bdark:border-\[\#[a-fA-F0-9]+\]\b/g, replacement: '' },
  
  // Backgrounds -> theme-card
  { pattern: /(?<!hover:)(?<!focus:)\bbg-white\b/g, replacement: 'bg-theme-card' },
  { pattern: /\bhover:bg-white\b/g, replacement: 'hover:bg-theme-card' },
  { pattern: /(?<!hover:)(?<!focus:)\bbg-\[\#111113\]\b/g, replacement: 'bg-theme-card' },
  
  // Backgrounds -> theme-surface
  { pattern: /(?<!hover:)(?<!focus:)\bbg-slate-50\b/g, replacement: 'bg-theme-surface' },
  { pattern: /\bhover:bg-slate-50\b/g, replacement: 'hover:bg-theme-surface' },
  
  // Backgrounds -> theme-bg
  { pattern: /(?<!hover:)(?<!focus:)\bbg-slate-100\b/g, replacement: 'bg-theme-bg' },
  { pattern: /(?<!hover:)(?<!focus:)\bbg-\[\#FAFAFA\]\b/g, replacement: 'bg-theme-bg' },
  { pattern: /(?<!hover:)(?<!focus:)\bbg-\[\#09090B\]\b/g, replacement: 'bg-theme-bg' },

  // Text -> theme-text
  { pattern: /(?<!hover:)(?<!focus:)\btext-slate-900\b/g, replacement: 'text-theme-text' },
  { pattern: /(?<!hover:)(?<!focus:)\btext-slate-800\b/g, replacement: 'text-theme-text' },
  { pattern: /(?<!hover:)(?<!focus:)\btext-\[\#0F172A\]\b/g, replacement: 'text-theme-text' },
  { pattern: /(?<!hover:)(?<!focus:)\btext-\[\#FAFAFA\]\b/g, replacement: 'text-theme-text' },
  { pattern: /\bhover:text-slate-900\b/g, replacement: 'hover:text-theme-text' },
  { pattern: /\bhover:text-slate-800\b/g, replacement: 'hover:text-theme-text' },

  // Text -> theme-text-sec
  { pattern: /(?<!hover:)(?<!focus:)\btext-slate-700\b/g, replacement: 'text-theme-text-sec' },
  { pattern: /(?<!hover:)(?<!focus:)\btext-slate-600\b/g, replacement: 'text-theme-text-sec' },
  { pattern: /(?<!hover:)(?<!focus:)\btext-slate-500\b/g, replacement: 'text-theme-text-sec' },
  { pattern: /(?<!hover:)(?<!focus:)\btext-slate-400\b/g, replacement: 'text-theme-text-sec' },
  { pattern: /(?<!hover:)(?<!focus:)\btext-\[\#64748B\]\b/g, replacement: 'text-theme-text-sec' },
  { pattern: /(?<!hover:)(?<!focus:)\btext-\[\#A1A1AA\]\b/g, replacement: 'text-theme-text-sec' },
  { pattern: /\bhover:text-slate-700\b/g, replacement: 'hover:text-theme-text-sec' },
  { pattern: /\bhover:text-slate-600\b/g, replacement: 'hover:text-theme-text-sec' },

  // Borders -> theme-border
  { pattern: /(?<!hover:)(?<!focus:)\bborder-slate-200\b/g, replacement: 'border-theme-border' },
  { pattern: /(?<!hover:)(?<!focus:)\bborder-slate-100\b/g, replacement: 'border-theme-border' },
  { pattern: /(?<!hover:)(?<!focus:)\bborder-\[\#27272A\]\b/g, replacement: 'border-theme-border' },
  { pattern: /(?<!hover:)(?<!focus:)\bborder-white\b/g, replacement: 'border-theme-border' },

  // Cleanup any double spaces created by removing dark variants
  { pattern: /  +/g, replacement: ' ' },
  { pattern: / \}/g, replacement: '}' },
  { pattern: /" /g, replacement: '"' },
  { pattern: / '/g, replacement: '\'' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { pattern, replacement } of replacements) {
        content = content.replace(pattern, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log("Done.");
