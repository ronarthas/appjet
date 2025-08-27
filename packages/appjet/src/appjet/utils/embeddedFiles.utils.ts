// utils/embeddedFiles.utils.ts

import type { ExtractEmbeddedFileOptions } from "../types/extractFile.interface";
import type { ExtractedFile } from "../types/extractFile.interface";
/**
 * Extracts a file from Bun's embedded files
 * @param options Search options for the file
 * @returns Extracted file or null if not found
 */
export async function extractEmbeddedFile(
  options: ExtractEmbeddedFileOptions,
): Promise<ExtractedFile | null> {
  const { fileName, extension, exactMatch = false } = options;

  const file = Array.from(Bun.embeddedFiles).find((f) => {
    if (exactMatch) {
      return f.name === fileName;
    }

    const matchesName = f.name.includes(fileName);
    const matchesExtension = extension ? f.name.endsWith(extension) : true;

    return matchesName && matchesExtension;
  });

  if (!file) {
    return null;
  }

  const data = await file.bytes();

  return {
    name: file.name,
    data,
    size: data.length,
  };
}

/**
 * Extracts and saves an embedded file to disk
 * @param options Search options for the file
 * @param outputPath Destination path
 * @returns true if successful, false if file not found
 */
export async function extractEmbeddedFileToPath(
  options: ExtractEmbeddedFileOptions,
  outputPath: string,
): Promise<boolean> {
  const extractedFile = await extractEmbeddedFile(options);

  if (!extractedFile) {
    return false;
  }

  await Bun.write(outputPath, extractedFile.data);
  return true;
}

/**
 * Lists all embedded files with their information
 * @returns List of embedded files
 */
export function listEmbeddedFiles(): Array<{ name: string; size: number }> {
  return Array.from(Bun.embeddedFiles).map((file) => ({
    name: file.name,
    size: file.size,
  }));
}
