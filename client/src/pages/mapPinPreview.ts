export function mapPinPreviewText(notes: string | null, maxLength = 120): string | null {
  if (!notes?.trim()) return null;
  const plain = notes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[\r\n]+/g, " ")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return null;
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 1).trimEnd()}…`;
}
