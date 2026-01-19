import axios from "axios";
import type { PixabayResponse } from "./types/pixabay";
import { PER_PAGE } from "./pagination";

export const getImagesByQuery = async (query: string, page: number): Promise<PixabayResponse> => {
  const response = await axios.get<PixabayResponse>(`https://pixabay.com/api/`, {
    params: {
      q: query,
      page,
      per_page: PER_PAGE,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      key: '54273076-6a88fde4845a47ce1f049ab18'
    },
  });
  return response.data;
};