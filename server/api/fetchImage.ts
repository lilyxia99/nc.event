import { H3Event } from "h3";
import axios from "axios";

export default eventHandler(async (event: H3Event) => {
  const { url } = getQuery(event);

  if (typeof url !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "URL should be a string",
    });
  }

  try {
    // Try to check the size of the image before fetching it, but don't fail if HEAD request fails
    let size = 0;
    try {
      const sizeResponse = await axios.head(url, { timeout: 5000 });
      size = parseInt(sizeResponse.headers["content-length"] || "0");
    } catch (headError) {
      console.log("HEAD request failed, proceeding with GET request");
    }

    // If we got a size and it exceeds the limit (5 MB), return an error
    if (size > 5 * 1024 * 1024) {
      throw createError({
        statusCode: 413,
        statusMessage: "The specified image is too large.",
      });
    }

    // Special handling for Imgur URLs
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    // Add referer for Imgur
    if (url.includes('imgur.com')) {
      headers['Referer'] = 'https://imgur.com/';
    }

    const response = await axios.get(url, { 
      responseType: "arraybuffer",
      timeout: 10000,
      maxContentLength: 5 * 1024 * 1024, // 5MB limit
      headers: headers
    });

    // Ensure mime type of the response content will be an image
    const type = response.headers["content-type"];
    if (!type || !type.startsWith("image/")) {
      throw createError({
        statusCode: 400,
        statusMessage: "Specified URL does not point to an image.",
      });
    }

    // Set appropriate headers and return an image response
    setHeader(event, "content-type", type);

    // Add caching headers
    setHeader(event, "Cache-Control", "public, max-age=31536000, immutable"); // Cache for a year and don't revalidate

    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("Error fetching image:", error.message);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch image: " + error.message,
    });
  }
});
