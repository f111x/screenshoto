import type { Metadata } from 'next';
import ShareViewer from './ShareViewer';

export const runtime = 'edge';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Screensho.to — 分享 #${id.slice(0, 8)}`,
    description: '查看通过 Screensho.to 分享的代码片段',
    openGraph: {
      title: `Screensho.to 分享 #${id.slice(0, 8)}`,
      description: '查看 AI 生成的 UI 代码',
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  return <ShareViewer id={id} />;
}
