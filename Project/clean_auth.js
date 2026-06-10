const fs = require('fs');
const path = require('path');

const files = [
  path.join('C:', 'Users', 'raish', 'Desktop', 'Project', 'IncidentIQ', 'Project', 'frontend', 'src', 'pages', 'LoginPage.jsx'),
  path.join('C:', 'Users', 'raish', 'Desktop', 'Project', 'IncidentIQ', 'Project', 'frontend', 'src', 'pages', 'RegisterPage.jsx')
];

const replacements = [
  ["const { theme} = useTheme();", ""],
  ["const isDark = theme ==='dark';", ""],
  ["${isDark ?'auth-grid-dark text-[#FAFAFA]' :'auth-grid-light text-theme-text'}", "auth-grid-light dark:auth-grid-dark text-theme-text"],
  ["${isDark ?'bg-[#A855F7]/20 mix-blend-screen' :'bg-blue-100'}", "bg-blue-100 dark:bg-[#A855F7]/20 dark:mix-blend-screen"],
  ["${isDark ?'bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] ai-glow-subtle' :'bg-blue-600'}", "bg-blue-600 dark:bg-gradient-to-br dark:from-[#A855F7] dark:to-[#8B5CF6] dark:ai-glow-subtle"],
  ["${isDark ?'text-white' :'text-theme-text'}", "text-theme-text dark:text-white"],
  ["${isDark ?'text-[#8B5CF6]' :'text-blue-600'}", "text-blue-600 dark:text-[#8B5CF6]"],
  ["${isDark ?'bg-gradient-to-r from-[#A855F7] to-[#8B5CF6]' :'bg-gradient-to-r from-blue-600 to-cyan-500'}", "bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#A855F7] dark:to-[#8B5CF6]"],
  ["${isDark ?'text-[#A1A1AA]' :'text-theme-text-sec'}", "text-theme-text-sec"],
  ["${isDark ?'bg-[#111113] border-[#27272A]' :'bg-theme-card border-theme-border'}", "bg-theme-card border-theme-border"],
  ["${isDark ?'bg-[#111113]/90 backdrop-blur-xl border border-[#27272A]' :'bg-theme-card backdrop-blur-xl border border-theme-border'}", "bg-theme-card backdrop-blur-xl border border-theme-border"],
  ["${isDark ?'bg-[#09090B] border border-[#27272A]' :'bg-theme-bg'}", "bg-theme-bg"],
  ["${isDark ?'text-[#A1A1AA] hover:text-white' :'text-theme-text-sec hover:text-theme-text dark:hover:text-slate-100'}", "text-theme-text-sec hover:text-theme-text"],
  ["${isDark ?'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]' :'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100'}", "bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-900/20"],
  ["${isDark ?'bg-[#09090B] border border-[#27272A] text-white placeholder-[#A1A1AA]/50 focus:ring-[#A855F7]/50 focus:border-[#A855F7]' :'bg-theme-card border border-theme-border text-theme-text placeholder-slate-400 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm'}", "bg-theme-card border border-theme-border text-theme-text placeholder-theme-text-sec focus:ring-blue-600/20 dark:focus:ring-[#A855F7]/50 focus:border-blue-600 dark:focus:border-[#A855F7] shadow-sm"],
  ["${isDark ?'bg-[#09090B] border-[#27272A] text-[#A855F7]' :'text-blue-600 border-slate-300'}", "text-blue-600 dark:text-[#A855F7] border-theme-border bg-theme-card"],
  ["${isDark ?'bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] text-white hover:brightness-110 shadow-lg shadow-[#A855F7]/25' :'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'}", "text-white shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 dark:bg-gradient-to-r dark:from-[#A855F7] dark:to-[#8B5CF6] dark:hover:brightness-110 dark:shadow-[#A855F7]/25"],
  ["${isDark ?'border-[#27272A]' :'border-theme-border'}", "border-theme-border"],
  ["${isDark ?'bg-[#111113] text-[#A1A1AA]' :'bg-theme-card text-theme-text-sec'}", "bg-theme-card text-theme-text-sec"],
  ["${isDark ?'bg-[#09090B] border border-[#27272A] text-white hover:bg-[#18181B]' :'bg-theme-card border border-theme-border text-theme-text-sec hover:bg-theme-surface dark:hover:bg-slate-800/50 shadow-sm'}", "bg-theme-card border border-theme-border text-theme-text hover:bg-theme-surface shadow-sm"],
  ["className={isDark ?'text-[#A1A1AA]' :'text-theme-text-sec'}", 'className="text-theme-text-sec"']
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
