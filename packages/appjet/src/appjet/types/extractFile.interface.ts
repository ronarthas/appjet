/**
 * Options for extracting embedded files
 */
export interface ExtractEmbeddedFileOptions {
  /** Partial file name to search for */
  fileName: string;
  /** File extension to search for (optional) */
  extension?: string;
  /** Exact match for the complete file name */
  exactMatch?: boolean;
}

/**
 * Result of embedded file extraction
 */
export interface ExtractedFile {
  /** Full name of the found file */
  name: string;
  /** File data as bytes */
  data: Uint8Array;
  /** File size */
  size: number;
}
