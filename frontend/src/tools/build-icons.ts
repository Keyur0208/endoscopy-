import path from 'path';
// import { loadIcon } from '@iconify/utils';
import { promises as fs } from 'fs';
import { loadIcon } from '@iconify/react';

// Recursively scan files for icon names
async function findIconNames(dir: string): Promise<Set<string>> {
  // Match icon="...", icon('...'), icon(`...`), icon: '...'
  const patterns = [
    /icon\s*=\s*["']([\w-]+:[\w-]+)["']/g, // icon="mdi:account"
    /icon\s*\(\s*["'`]([\w-]+:[\w-]+)["'`]\s*\)/g, // icon('mdi:account') or icon(`mdi:account`)
    /icon\s*:\s*["']([\w-]+:[\w-]+)["']/g, // icon: 'mdi:account'
  ];
  const iconNames = new Set<string>();

  async function scan(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.isFile() && /\.(tsx?|jsx?|html)$/.test(entry.name)) {
          const content = await fs.readFile(fullPath, 'utf8');
          patterns.forEach((pattern) => {
            Array.from(content.matchAll(pattern)).forEach((match) => {
              iconNames.add(match[1]);
            });
          });
        }
      })
    );
  }

  await scan(dir);
  return iconNames;
}

async function buildIcons() {
  // Scan src and public folders
  const srcIcons = await findIconNames(path.resolve('src'));
  const publicIcons = await findIconNames(path.resolve('public'));
  const allIcons = new Set([...Array.from(srcIcons), ...Array.from(publicIcons)]);

  const result: Record<string, any> = {};
  await Promise.all(
    Array.from(allIcons).map(async (name) => {
      try {
        // const [collection, iconName] = name.split(':');
        // if (!collection || !iconName) {
        //   console.warn(`⚠️ Invalid icon name: ${name}`);
        //   return;
        // }
        const icon = await loadIcon(name);
        if (!icon) {
          console.warn(`⚠️ Not found: ${name}`);
          return;
        }
        result[name] = icon;
        console.log(`✅ Added: ${name}`);
      } catch (err) {
        console.warn(`⚠️ Error loading: ${name}`);
      }
    })
  );

  const outputDir = path.resolve('src/components/iconify');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'icons.json'), JSON.stringify(result, null, 2));
  console.log(`📦 icons.json generated with ${Object.keys(result).length} icons.`);
}

buildIcons();
