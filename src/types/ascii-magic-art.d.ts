declare module 'ascii-magic-art/pieces/rainforest-falls-mist.js' {
  export interface AsciiFrame {
    text: string;
    color: string;
    palette?: Record<string, string>;
  }

  export interface PieceMeta {
    slug: string;
    name: string;
    category: string;
    note: string;
    tags: string[];
    cols: number;
    rows: number;
    fps: number;
    cell?: string;
    look?: string;
    dots?: {
      tone?: Record<string, number>;
    };
    palette: Record<string, string>;
  }

  export const meta: PieceMeta;
  export default function createRainforestFallsMist(): (t: number) => AsciiFrame;
}

declare module 'ascii-magic-art/runtime/canvas.js' {
  import type { AsciiFrame } from 'ascii-magic-art/pieces/rainforest-falls-mist.js';

  export interface PaintOptions {
    x?: number;
    y?: number;
    cw: number;
    ch: number;
    ink?: string;
    mode?: 'text' | 'circle' | 'square' | 'dither';
    size?: number;
    density?: number;
    steps?: number;
    lift?: boolean;
    tone?: Record<string, number>;
    dpr?: number;
  }

  export function paint(
    ctx: CanvasRenderingContext2D,
    frame: AsciiFrame | string,
    palette: Record<string, string>,
    opts: PaintOptions
  ): void;
}
