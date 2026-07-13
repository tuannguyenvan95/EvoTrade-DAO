const fs = require('fs');
const files = ['src/pages/Dashboard.tsx', 'src/components/Footer.tsx', 'src/App.tsx'];
files.forEach(file => {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.replaceAll('bg-slate-950', 'bg-slate-50');
    content = content.replaceAll('bg-slate-900/80', 'bg-slate-50/80');
    content = content.replaceAll('bg-slate-900', 'bg-white');
    content = content.replaceAll('bg-white/5', 'bg-white shadow-sm');
    content = content.replaceAll('bg-black/20', 'bg-slate-100');
    content = content.replaceAll('border-white/10', 'border-slate-200');
    content = content.replaceAll('border-white/5', 'border-slate-100');
    content = content.replaceAll('text-white', 'text-slate-900');
    content = content.replaceAll('text-slate-400', 'text-slate-500');
    content = content.replaceAll('text-slate-300', 'text-slate-600');
    content = content.replaceAll('hover:bg-white/10', 'hover:bg-slate-50');
    content = content.replaceAll('hover:text-white', 'hover:text-slate-900');
    
    if(file.includes('Dashboard')) {
        content = content.replaceAll('#0f172a', '#ffffff');
        content = content.replaceAll('#1e293b', '#e2e8f0');
        content = content.replaceAll("color: '#fff'", "color: '#0f172a'");
        content = content.replaceAll('bg-black', 'bg-slate-900 text-slate-100');
    }
    
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Done');
