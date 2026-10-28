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

export function detachMapPinPhotos(existing: readonly string[], moved: readonly string[]): string[] {
  return existing.filter(url => !moved.includes(url));
}

export function detachMapPinNote(existing: string | null, movedNote: string): string | null {
  if (!existing || !movedNote) return existing;
  return existing.split("\n\n").filter(paragraph => paragraph !== movedNote).join("\n\n");
}
