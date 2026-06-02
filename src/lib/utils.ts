export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function compressImage(file: File, maxWidth = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height / width) * maxWidth;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getHistory(): { id: string; imageUrl: string; framework: string; code: string; createdAt: number }[] {
  try {
    return JSON.parse(localStorage.getItem('screenshoto_history') || '[]');
  } catch {
    return [];
  }
}

export function addToHistory(item: { id: string; imageUrl: string; framework: string; code: string; createdAt: number }): void {
  const history = getHistory();
  history.unshift(item);
  localStorage.setItem('screenshoto_history', JSON.stringify(history.slice(0, 50)));
}

export function getQuota(): { used: number; limit: number } {
  try {
    const quota = JSON.parse(localStorage.getItem('screenshoto_quota') || '{"used":0,"limit":20}');
    return quota;
  } catch {
    return { used: 0, limit: 20 };
  }
}

export function incrementQuota(): void {
  const quota = getQuota();
  quota.used += 1;
  localStorage.setItem('screenshoto_quota', JSON.stringify(quota));
}

export function getRemainingQuota(): number {
  const quota = getQuota();
  return Math.max(0, quota.limit - quota.used);
}

export function hasQuota(): boolean {
  return getRemainingQuota() > 0;
}
