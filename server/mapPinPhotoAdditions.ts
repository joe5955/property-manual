export function appendUniqueMapPinPhotos(existing: readonly string[], additions: readonly string[]): string[] {
  const photos = [...existing];
  for (const url of additions) {
    if (!photos.includes(url)) photos.push(url);
  }
  return photos;
}

export function appendMapPinNote(existing: string | null, addition: string): string {
  if (!addition || existing?.includes(addition)) return existing ?? "";
  return existing ? `${existing}\n\n${addition}` : addition;
}
