import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: npm run studio:new -- <kebab-case-slug>");
  process.exit(1);
}
const dir = path.join(root, "apps", slug);
if (fs.existsSync(dir)) {
  console.error(`apps/${slug} already exists.`);
  process.exit(1);
}
const title = slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const today = new Date().toISOString().slice(0, 10);
fs.mkdirSync(path.join(dir, "src"), { recursive: true });
const files = {
  "package.json": JSON.stringify({name:`@studio/${slug}`,private:true,version:"0.1.0",type:"module",scripts:{dev:"vite",build:"vite build",preview:"vite preview"},dependencies:{"@vitejs/plugin-react":"^4.3.1",vite:"^5.4.0",react:"^18.3.1","react-dom":"^18.3.1"},devDependencies:{}}, null, 2) + "\n",
  "prototype.json": JSON.stringify({slug,title,description:"Describe the design question this prototype explores.",status:"exploring",fidelity:"exploration",updated:today,productionPath:`/${slug}`,tags:[],principles:["context/design-principles.md","context/interaction-rules.md"],blueprints:[],handoff:{dontMiss:[],ignore:[]}}, null, 2) + "\n",
  "index.html": '<!doctype html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>' + title + '</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>\n',
  "src/main.jsx": 'import React from "react";\nimport { createRoot } from "react-dom/client";\nimport "./styles.css";\n\nfunction App(){return <main><p className="eyebrow">Design Studio prototype</p><h1>' + title + '</h1><p>Start the executable prototype here.</p></main>}\ncreateRoot(document.getElementById("root")).render(<App />);\n',
  "src/styles.css": ':root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#172026;background:#f6f7f8}*{box-sizing:border-box}body{margin:0}main{max-width:900px;margin:0 auto;padding:12vh 32px}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:12px;color:#68727a}h1{font-size:clamp(40px,8vw,80px);letter-spacing:-.04em;margin:.2em 0}p{font-size:18px;line-height:1.6}\n',
  "vite.config.js": 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()] });\n',
  "AGENTS.md": '# Prototype instructions\n\nRead the root `AGENTS.md` and this app\'s `prototype.json` before making changes. Keep edits scoped to this prototype unless shared context genuinely needs to change.\n'
};
for (const [name, contents] of Object.entries(files)) {
  const file = path.join(dir, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}
console.log(`Created apps/${slug}. Run npm install, then npm run registry.`);
