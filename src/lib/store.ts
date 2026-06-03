import type { ShareData } from '@/types';

// In-memory store for Edge Runtime compatibility
// Data is lost on cold starts — for production, use Cloudflare KV
const shares = new Map<string, ShareData>();

export async function saveShare(data: ShareData): Promise<void> {
  shares.set(data.id, data);
}

export async function getShare(id: string): Promise<ShareData | null> {
  return shares.get(id) || null;
}
