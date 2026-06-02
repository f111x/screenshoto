import type { ShareData } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data', 'shares');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(id: string): string {
  return path.join(DATA_DIR, `${id}.json`);
}

export async function saveShare(data: ShareData): Promise<void> {
  ensureDir();
  fs.writeFileSync(filePath(data.id), JSON.stringify(data, null, 2), 'utf-8');
}

export async function getShare(id: string): Promise<ShareData | null> {
  try {
    const fp = filePath(id);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf-8')) as ShareData;
  } catch {
    return null;
  }
}
