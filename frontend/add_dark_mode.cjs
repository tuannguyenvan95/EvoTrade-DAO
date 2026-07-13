const fs = require('fs');

const replaceInFile = (file, replacements) => {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replaceAll(search, replace);
    }
    fs.writeFileSync(file, content, 'utf8');
};

const commonReplacements = [
    // Backgrounds
    ['bg-white', 'bg-white dark:bg-slate-900'],
    ['bg-slate-50', 'bg-slate-50 dark:bg-slate-950'],
    ['bg-slate-100', 'bg-slate-100 dark:bg-slate-800'],
    ['bg-slate-200', 'bg-slate-200 dark:bg-slate-700'],
    
    // Text colors
    ['text-slate-900', 'text-slate-900 dark:text-white'],
    ['text-slate-800', 'text-slate-800 dark:text-slate-100'],
    ['text-slate-700', 'text-slate-700 dark:text-slate-300'],
    ['text-slate-600', 'text-slate-600 dark:text-slate-400'],
    ['text-slate-500', 'text-slate-500 dark:text-slate-400'],

    // Borders
    ['border-slate-200', 'border-slate-200 dark:border-slate-800'],
    ['border-slate-100', 'border-slate-100 dark:border-slate-800'],
    ['border-slate-300', 'border-slate-300 dark:border-slate-700'],

    // Hover
    ['hover:bg-slate-50', 'hover:bg-slate-50 dark:hover:bg-slate-800'],
    ['hover:bg-slate-100', 'hover:bg-slate-100 dark:hover:bg-slate-700'],
    ['hover:bg-slate-200', 'hover:bg-slate-200 dark:hover:bg-slate-700'],
    ['hover:text-slate-900', 'hover:text-slate-900 dark:hover:text-white'],
];

const files = [
    'src/pages/Dashboard.tsx',
    'src/pages/Landing.tsx',
    'src/components/Footer.tsx',
];

files.forEach(file => replaceInFile(file, commonReplacements));

// Specific fixes for Dashboard
const dashboardReplacements = [
    // Fix double dark variants if any
    ['dark:bg-slate-900 dark:bg-slate-900', 'dark:bg-slate-900'],
    ['dark:text-white dark:text-white', 'dark:text-white'],
    ['dark:border-slate-800 dark:border-slate-800', 'dark:border-slate-800'],
    
    // Glassmorphism and Hover 3D
    ['className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800', 'className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300'],
    ['className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800', 'className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300'],
    
    // Header glassmorphism
    ['bg-white dark:bg-slate-900 shadow-sm0 backdrop-blur-md', 'bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur-md'],
];
replaceInFile('src/pages/Dashboard.tsx', dashboardReplacements);
replaceInFile('src/pages/Landing.tsx', [
    ['bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800', 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300']
]);

console.log('Theme injected!');
