import apiClient from "../common/api";
import { CatImage } from "../models/catImage";

let currentCatImage: CatImage | null = null;

export const getCurrentCatImage = (): CatImage | null => {
  return currentCatImage;
};

export const updateCatImage = async () => {
  try {
    const response = await apiClient.get("/images/search");
    currentCatImage = response.data[0] as CatImage;
    console.info(`Updated cat image: ${currentCatImage.url}`);
  } catch (error) {
    console.error(`Error while updating cat image: ${error}`);
  }
};
