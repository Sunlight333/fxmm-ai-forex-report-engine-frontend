"use client";

import { useState, useCallback } from "react";

/* ── File System Access API types (not in default TS lib) ── */

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

interface SaveFilePickerOpts {
  suggestedName?: string;
  types?: FilePickerAcceptType[];
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: Blob | BufferSource | string): Promise<void>;
  close(): Promise<void>;
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

declare global {
  interface Window {
    showSaveFilePicker?: (opts?: SaveFilePickerOpts) => Promise<FileSystemFileHandle>;
  }
}

/**
 * Hook for downloading PDFs with save-path selection.
 *
 * Uses the File System Access API (`showSaveFilePicker`) when available,
 * which opens a native OS save dialog and remembers the last directory.
 * Falls back to standard `<a download>` for unsupported browsers.
 */
export function usePdfDownload() {
  const [downloading, setDownloading] = useState(false);

  const supportsFilePicker =
    typeof window !== "undefined" && typeof window.showSaveFilePicker === "function";

  const download = useCallback(
    async (url: string, suggestedName: string) => {
      if (!url) return;
      setDownloading(true);

      try {
        // Fetch the PDF as a blob
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Download failed (${res.status})`);
        const blob = await res.blob();

        if (supportsFilePicker && window.showSaveFilePicker) {
          // Native save dialog — user picks the folder and filename.
          // The browser remembers the last chosen directory per-origin.
          const fileHandle = await window.showSaveFilePicker({
            suggestedName,
            types: [
              {
                description: "PDF Document",
                accept: { "application/pdf": [".pdf"] },
              },
            ],
          });

          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        } else {
          // Fallback: blob URL + hidden anchor (uses browser default download dir)
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = suggestedName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }
      } catch (err: unknown) {
        // User cancelled the save dialog — not an error
        if (err instanceof DOMException && err.name === "AbortError") return;
        throw err;
      } finally {
        setDownloading(false);
      }
    },
    [supportsFilePicker]
  );

  return { download, downloading, supportsFilePicker };
}
