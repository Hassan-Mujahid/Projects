const { Ad } = require("../models");
const cloudinary = require("cloudinary").v2;

class adServices {
  fetchAllAds = async ({ offset, limit }) => {
    console.log("offset:", offset);
    console.log("limit:", limit);
    try {
      const ads = await Ad.findAll({
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });
      return ads;
    } catch (err) {
      console.log(err);
      return { Error: err.message };
    }
  };

  checkAdsLength = async () => {
    try {
      const ads = await Ad.findAll();
      const adsLength = ads.length;
      return adsLength;
    } catch (err) {
      console.log(err);
      return { Error: err.message };
    }
  };

  fetchOneAd = async (uuid) => {
    try {
      const ad = await Ad.findOne({ where: { uuid } });
      return ad;
    } catch (err) {
      console.log(err);
      return { Error: err.message };
    }
  };

  deleteAd = async (uuid) => {
    try {
      const ad = await Ad.destroy({ where: { uuid } });
      console.log("DELETED SUCCESFULLY!");
      return { DeletedSuccessfully: true };
    } catch (err) {
      console.log(err);
      return { Error: err.message };
    }
  };

  createAd = async (data) => {
    const {
      userId,
      price,
      title,
      description,
      city,
      adStreetAddress,
      brand,
      images,
      firstName,
      lastName,
    } = await data;

    try {
      const ad = await Ad.create({
        userId,
        price,
        title,
        description,
        city,
        adStreetAddress,
        brand,
        images,
        firstName,
        lastName,
      });
      return ad;
    } catch (err) {
      console.error(err);
      return { Error: err.message };
    }
  };

  extractImageFiles = (fileObjects) => {
    const imageFiles = [];
    try {
      for (const fileObj of fileObjects) {
        // Check if the file type is an image (you can adjust this condition as needed)
        if (fileObj.type.startsWith("image/")) {
          console.log("imageFile:", fileObj);
          imageFiles.push(fileObj);
        }
      }
      return imageFiles;
    } catch (err) {
      console.log(err);
      return { Error: "Extracting image files failed!" };
    }
  };

  uploadImagesToCloudinary = async (images) => {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    try {
      const imageUrls = [];

      const get_url = async (bufferImage) => {
        return await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(async (error, result) => {
              if (error) {
                console.error("Upload failed:", error);
                return reject(error);
              } else {
                console.log("Upload succeeded:", result);
                // imageUrls.push(result.secure_url);
                // console.log("imageUrlsCheck:", imageUrls);
                return resolve(result.secure_url);
              }
            })
            .end(bufferImage);
        });
      };

      const uploadImages = async (images) => {
        const imagePaths = await Promise.all(
          images.map(async (image) => {
            const imageBuffer = image.buffer;
            const secure_url = await get_url(imageBuffer);
            return secure_url;
          })
        );
        return imagePaths;
      };

      //  for (const image of images) {
      //     console.log("imagesPaths", image);
      //     const imageBuffer = image.buffer;
      //     // { resource_type: "image" },
      //    await cloudinary.uploader
      //       .upload_stream(async (error, result) => {
      //         if (error) {
      //           console.error("Upload failed:", error);
      //         } else {
      //           console.log("Upload succeeded:", result);
      //           imageUrls.push(result.secure_url);
      //           console.log("imageUrlsCheck:", imageUrls);
      //         }
      //       })
      //       .end(imageBuffer);
      //     // console.log("secure_url:", secure_url);
      //     // imageUrls.push(secure_url);
      //   }
      const paths = await uploadImages(images);
      console.log("imagePaths:", paths);
      // console.log("imageUrls:", imageUrls);
      return paths;
    } catch (err) {
      console.log(err);
      return { Error: "Image upload failed!" };
    }
  };
}

module.exports = adServices;
