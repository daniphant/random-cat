import express from "express";
import { getCurrentCatImage, updateCatImage } from "./services/updateCatImage";
import {
  APP_PORT,
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  INTERVAL_BETWEEN_CAT_IMAGE_UPDATES,
} from "./common/constants";

// Timeout to update cat image
setTimeout(updateCatImage, INTERVAL_BETWEEN_CAT_IMAGE_UPDATES);

const app = express();

app.listen(APP_PORT, () => {
  // Run updateCatImage for the first time
  console.info(`Server is listening on port ${APP_PORT}`);

  if (getCurrentCatImage() === null) {
    updateCatImage();
  }
});

// We only want to return the cat image directly, so it works within GitHub's Markdown
app.get("/", (req, res) => {
  const { width, height } = req.query;

  const currentCatImage = getCurrentCatImage();

  if (currentCatImage === null) {
    res.status(500).send("Failed to get cat image");
    return;
  }

  const imgHtml = `<img src="${currentCatImage.url}" width="${
    width ?? DEFAULT_IMAGE_WIDTH
  }" height="${height ?? DEFAULT_IMAGE_HEIGHT}" />`;

  res.send(imgHtml);
});
