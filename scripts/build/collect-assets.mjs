import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');
const distDir = path.join(rootDir, 'dist', 'desktop');

console.log("[collect] Collecting assets into dist/desktop...");

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

function copyIfExists(src, dst) {
    if (fs.existsSync(src)) {
        if (fs.statSync(src).isDirectory()) {
            fs.cpSync(src, dst, { recursive: true });
        } else {
            fs.copyFileSync(src, dst);
        }
        return true;
    }
    return false;
}


// ── multi-instance icons ────────────────────────────────────────────────────
const lolllSrc    = path.join(process.env.USERPROFILE || "", "Desktop", "lolll");
const outMIIcons  = path.join(distDir, "multi-instance-icons");
fs.mkdirSync(outMIIcons, { recursive: true });
if (fs.existsSync(lolllSrc)) {
    let copied = 0;
    for (let i = 1; i <= 5; i++) {
        const src = path.join(lolllSrc, `${i}.ico`);
        if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(outMIIcons, `${i}.ico`)); copied++; }
    }
    console.log(`[collect] ✅ ${copied} multi-instance icons copied`);
} else {
    console.warn("[collect] ⚠️ Desktop/lolll NOT FOUND — multi-instance icons missing");
}

// ── mac folder ──────────────────────────────────────────────────────────────
if (copyIfExists(path.join(rootDir, "mac"), path.join(distDir, "mac"))) {
    console.log("[collect] ✅ mac folder copied");
}

console.log("\n[collect] Done collecting assets!");
