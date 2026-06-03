import OpenAI from 'openai';

export interface ProviderConfig {
  baseURL: string;
  apiKey: string;
  model: string;
}

/**
 * Provider presets for different AI services.
 * All use OpenAI-compatible API format.
 */
const PROVIDER_PRESETS: Record<string, { baseURL: string; defaultModel: string }> = {
  openai: {
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
  },
  dashscope: {
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-vl-max',
  },
  zhipu: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4v-plus',
  },
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
  },
  moonshot: {
    baseURL: 'https://api.moonshot.cn/v1',
    defaultModel: 'kimi-k2.5',
  },
  stepfun: {
    baseURL: 'https://api.stepfun.com/v1',
    defaultModel: 'step-2-16k',
  },
  custom: {
    baseURL: '',
    defaultModel: '',
  },
};

/**
 * Get current AI provider configuration from environment variables.
 *
 * Env vars:
 *   AI_PROVIDER    - Provider name: openai | dashscope | zhipu | deepseek | custom (default: openai)
 *   AI_API_KEY     - API key for the provider
 *   AI_BASE_URL    - Custom base URL (only needed for 'custom' provider or override)
 *   AI_MODEL       - Model name override
 *   OPENAI_API_KEY - Fallback if AI_API_KEY not set (backward compat)
 */
export function getProviderConfig(): ProviderConfig {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const preset = PROVIDER_PRESETS[provider] || PROVIDER_PRESETS.openai;

  const baseURL = process.env.AI_BASE_URL || preset.baseURL;
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || '';
  const model = process.env.AI_MODEL || preset.defaultModel;

  return { baseURL, apiKey, model };
}

/**
 * Create an OpenAI-compatible client using the configured provider.
 */
export function createAIClient(config?: ProviderConfig): OpenAI {
  const cfg = config || getProviderConfig();

  if (!cfg.apiKey) {
    throw new Error('AI_API_KEY 或 OPENAI_API_KEY 未配置');
  }

  return new OpenAI({
    apiKey: cfg.apiKey,
    baseURL: cfg.baseURL,
  });
}

/**
 * System prompt for screenshot-to-code generation.
 */
export function buildSystemPrompt(framework: string): string {
  return `You are a front-end code generator. Given a screenshot of a UI, generate the corresponding code using Tailwind CSS.

Rules:
1. Output ONLY the code block, no explanations or markdown wrappers.
2. Use modern, clean semantic HTML5.
3. The code MUST be self-contained and renderable in a browser.
4. If text is visible in the image, use the exact same text.
5. Match colors, spacing, layout, and fonts as closely as possible.
6. Use responsive design (mobile-first).
7. Framework: ${framework}
   - "html" → plain HTML with Tailwind CDN (<script src="https://cdn.tailwindcss.com"></script>)
   - "react" → React functional component with Tailwind classes (React 18+, export default function App)
   - "vue" → Vue single-file component with <template> and <script setup>
   - "tailwind" → plain HTML with Tailwind CDN
8. For React: export default function App() { return (...); }, no imports.
9. For Vue: use <template> with one root element, <script setup lang="ts">.
10. Include placeholder images using https://placehold.co/400x300/EEE/999?text=Placeholder if needed.`;
}

/**
 * Clean AI output: remove markdown code fences.
 */
export function cleanCodeOutput(code: string): string {
  return code
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/\n?```$/gm, '')
    .trim();
}

/**
 * Get the provider display name for UI messages.
 */
export function getProviderName(): string {
  return (process.env.AI_PROVIDER || 'openai').toLowerCase();
}
