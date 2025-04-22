"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { wrtieClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not Signed In",
      Status: "Error",
    });
  }

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    const result = await wrtieClient.create({ _type: "startup", ...startup });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    return parseServerActionResponse({
      error: JSON.stringify(error),
      Status: "Error",
    });
  }
};

export async function validateImageUrl(url: string) {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");
    const isImage = contentType?.startsWith("image/");
    console.log("Url:", url);
    console.log("content-type:", contentType);
    console.log("isImage:", isImage);
    return isImage;
  } catch {
    return false;
  }
}

// export async function validateImageUrl(url: string) {
//   try {
//     let imageUrl = url;

//     // Step 1: Handle Unsplash URL - Get Direct Image Link
//     if (url.includes("unsplash.com/photos/")) {
//       const response = await fetch(url);
//       const html = await response.text();

//       // Log the raw HTML for debugging
//       // Attempt to extract the direct image URL from meta tags
//       const match = html.match(
//         /<meta property="og:image" content="(https:\/\/images\.unsplash\.com\/[^\s]+)"/
//       );

//       if (match) {
//         imageUrl = match[1]; // Direct image URL
//         console.log("Extracted Image URL from Unsplash:", imageUrl);
//       } else {
//         console.error("Failed to extract image URL from Unsplash page");
//         return false; // If meta tag isn't found, return false
//       }
//     }

//     // Step 2: Fetch the image metadata (HEAD request)
//     const res = await fetch(imageUrl, { method: "HEAD" });

//     // Check if the request was redirected (3xx status code)
//     if (res.status >= 300 && res.status < 400) {
//       console.warn(`Redirected to: ${res.url}`);
//       imageUrl = res.url; // Use the redirected URL
//     }

//     // Check the content type to verify it's an image
//     const contentType = res.headers.get("content-type");
//     const isImage = contentType?.startsWith("image");

//     console.log("Final Image URL:", imageUrl);
//     console.log("Content-Type:", contentType);
//     console.log("Is Image:", isImage);

//     return isImage ?? false; // Return false if it's not an image
//   } catch (error) {
//     console.error("Error validating image:", error);
//     return false; // Return false in case of error
//   }
// }
