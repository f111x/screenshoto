import OpenAI from 'openai';
import type { Framework } from '@/types';

const systemPrompt = (framework: Framework) => `You are a front-end code generator. Given a screenshot of a UI, generate the corresponding code using Tailwind CSS.

Rules:
1. Output ONLY the code block, no explanations or markdown wrappers.
2. Use modern, clean semantic HTML5.
3. The code MUST be self-contained and renderable in a browser.
4. If text is visible in the image, use the exact same text.
5. Match colors, spacing, layout, and fonts as closely as possible.
6. Use responsive design (mobile-first).
7. Framework: ${framework}
   - "html" → plain HTML with Tailwind CDN (<script src="https://cdn.tailwindcss.com">)
   - "react" → React functional component with Tailwind classes (assume React 18+)
   - "vue" → Vue single-file component with Tailwind classes
   - "tailwind" → plain HTML with Tailwind CDN (same as html)
8. For React output: use a single default-exported function component, no imports needed.
9. For Vue output: use <template> with a single root element, <script setup>.
10. Include placeholder images using https://placehold.co/400x300/EEE/999?text=Placeholder if needed.`;

export async function generateCode(
  imageDataUrl: string,
  framework: Framework,
  apiKey: string
): Promise<string> {
  // Strip the data URL prefix to get just the base64
  const base64Image = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: false, // API should only be called from server
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt(framework),
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Generate code from this UI screenshot:' },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: 'high',
            },
          },
        ],
      },
    ],
    max_tokens: 4096,
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content || '';
  // Clean up markdown code fences if the model wraps the output
  return content
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/\n?```$/gm, '')
    .trim();
}
