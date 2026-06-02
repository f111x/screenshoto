export type Framework = 'html' | 'react' | 'vue' | 'tailwind';

export interface ConversionResult {
  id: string;
  imageUrl: string;
  framework: Framework;
  code: string;
  createdAt: number;
}

export interface GenerateRequest {
  image: string; // base64 data URL
  framework: Framework;
}

export interface GenerateResponse {
  code: string;
  error?: string;
}
