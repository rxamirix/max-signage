export type StoryVideo = {
  src: string;
  poster?: string;
  alt?: string;
};

export function normalizeVideos(value: unknown): StoryVideo[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const src = String((item as StoryVideo).src || "").trim();
      if (!src) return null;
      const poster = String((item as StoryVideo).poster || "").trim();
      const alt = String((item as StoryVideo).alt || "").trim();
      return {
        src,
        ...(poster ? { poster } : {}),
        ...(alt ? { alt } : {}),
      } satisfies StoryVideo;
    })
    .filter((item): item is StoryVideo => item !== null);
}
