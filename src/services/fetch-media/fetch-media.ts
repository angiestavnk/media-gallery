import { MediaType } from "../../features/folder-slice";

export type MediaItem = {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  width: number;
  height: number;
};

const CACHE_KEY = "media_cache";
const CACHE_TTL = 60 * 60 * 1000;

export const FetchMediaService = {
  async fetchMedia(): Promise<MediaItem[]> {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    try {
      const response = await fetch("https://picsum.photos/v2/list?limit=30");
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const images = data.map((item: any, index: number) => ({
        id: `img-${item.id}`,
        name: `Image ${index + 1}`,
        type: "image" as MediaType,
        url: item.download_url,
        width: item.width,
        height: item.height,
      }));

      const result = [
        ...images,
        {
          id: "vid-1",
          name: "Sample Video",
          type: "video" as MediaType,
          url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        },
        {
          id: "gif-1",
          name: "Sample GIF",
          type: "gif" as MediaType,
          url: "https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif",
        },      ];

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));

      return result;
    } catch (error) {
      console.error("Error fetching media:", error);
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached).data : [];
    }
  },
};
