export const uploadLimits = {
  fileBytes: 50 * 1024 * 1024,
  requestBytes: 51 * 1024 * 1024,
  inputPixels: 120_000_000,
  webpDimension: 16_383,
} as const;

export const uploadHint = "PNG, JPG или WebP, до 50 МБ и 120 Мп. Автоматически сохраняются в WebP. Стороны длиннее 16 383 px уменьшаются пропорционально, без обрезки.";
