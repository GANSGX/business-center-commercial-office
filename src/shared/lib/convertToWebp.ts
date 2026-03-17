import sharp from 'sharp'

/**
 * Конвертирует изображение в WebP.
 * GIF пропускается без изменений (анимация).
 * Возвращает { buffer, filename } — готово для записи на диск.
 */
export async function convertToWebp(
  buffer: Buffer,
  originalName: string,
  baseName: string
): Promise<{ buffer: Buffer; filename: string }> {
  const ext = originalName.split('.').pop()?.toLowerCase() ?? ''

  // GIF не конвертируем — может быть анимированным
  if (ext === 'gif') {
    return { buffer, filename: `${baseName}.gif` }
  }

  const webpBuffer = await sharp(buffer).webp({ quality: 82, effort: 4 }).toBuffer()

  return { buffer: webpBuffer, filename: `${baseName}.webp` }
}
