const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:', 'Users', 'raish', 'Desktop', 'Project', 'IncidentIQ', 'Project', 'frontend', 'src');

const replacements = [
  // Backgrounds
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bbg-white\b/g, replacement: 'bg-white dark:bg-slate-900' },
  { pattern: /(?<!dark:)\bhover:bg-white\b/g, replacement: 'hover:bg-white dark:hover:bg-slate-900' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bbg-slate-50\b/g, replacement: 'bg-slate-50 dark:bg-slate-800/50' },
  { pattern: /(?<!dark:)\bhover:bg-slate-50\b/g, replacement: 'hover:bg-slate-50 dark:hover:bg-slate-800/50' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bbg-slate-100\b/g, replacement: 'bg-slate-100 dark:bg-slate-800' },
  { pattern: /(?<!dark:)\bhover:bg-slate-100\b/g, replacement: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bbg-blue-50\b/g, replacement: 'bg-blue-50 dark:bg-blue-900/20' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bbg-emerald-50\b/g, replacement: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bbg-red-50\b/g, replacement: 'bg-red-50 dark:bg-red-900/20' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bbg-amber-50\b/g, replacement: 'bg-amber-50 dark:bg-amber-900/20' },

  // Text
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\btext-slate-900\b/g, replacement: 'text-slate-900 dark:text-slate-100' },
  { pattern: /(?<!dark:)\bhover:text-slate-900\b/g, replacement: 'hover:text-slate-900 dark:hover:text-slate-100' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\btext-slate-800\b/g, replacement: 'text-slate-800 dark:text-slate-200' },
  { pattern: /(?<!dark:)\bhover:text-slate-800\b/g, replacement: 'hover:text-slate-800 dark:hover:text-slate-200' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\btext-slate-700\b/g, replacement: 'text-slate-700 dark:text-slate-300' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\btext-slate-600\b/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\btext-slate-500\b/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\btext-slate-400\b/g, replacement: 'text-slate-400 dark:text-slate-500' },

  // Borders
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bborder-slate-200\b/g, replacement: 'border-slate-200 dark:border-slate-700' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bborder-slate-100\b/g, replacement: 'border-slate-100 dark:border-slate-800' },
  { pattern: /(?<!dark:)(?<!hover:)(?<!focus:)\bborder-white\b/g, replacement: 'border-white dark:border-slate-700' },
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
