export type Framework = 'html' | 'react' | 'vue' | 'tailwind';

export interface ConversionResult {
  id: string;
  imageUrl: string;
  framework: Framework;
  code: string;
  createdAt: number;
}

export interface ShareData {
  id: string;
  imageUrl: string;
  framework: Framework;
  code: string;
  createdAt: number;
}

export interface GenerateRequest {
  image: string;
  framework: Framework;
}

export interface GenerateResponse {
  code: string;
  error?: string;
}
