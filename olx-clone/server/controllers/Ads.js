const jwt = require("jsonwebtoken");
const AdServices = require("../services/Ads");
const adServices = new AdServices();

class adController {
  fetchAllAds = async (req, res) => {
    const page = await req.query.page;
    const limit = await req.query.limit;
    try {
      const ads = await adServices.fetchAllAds({
        offset: (page - 1) * limit,
        limit,
      });
      const adsLength = await adServices.checkAdsLength();
      if (ads.Error) {
        throw new Error(ads.Error);
      } else if (adsLength.Error) {
        throw new Error(adsLength.Error);
      }

      return res.json({ ads, adsLength });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
  };

  fetchOneAd = async (req, res) => {
    const uuid = await req.params.bloguuid;
    console.log("fetchuuid:", uuid);
    try {
      const ad = await adServices.fetchOneAd(uuid);
      if (ad.Error) {
        throw new Error(ad.Error);
      }
      return res.json({ ad });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
  };

  deleteAd = async (req, res) => {
    const uuid = await req.params.bloguuid;
    try {
      console.log("ComingUUId:", uuid);
      const ad = await adServices.deleteAd(uuid);
      if (ad.Error) {
        throw new Error(ad.Error);
      }
      return res.json(ad);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
  };

  createAd = async (req, res) => {
    const { price, title, description, city, adStreetAddress, brand, token } =
      await req.body;
    // const textBody = await req.body;
    const images = await req.files;
    // console.log("textBody:", textBody);
    // console.log("images", images);

    const userData = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        if (err) res.status(403);
        return user;
      }
    );
    try {
      console.log("title:", title);
      console.log("description:", description);
      console.log("brand:", brand);
      console.log("price:", price);
      console.log("images:", images);
      console.log("city:", city);
      console.log("street:", adStreetAddress);
      console.log("fullName:", `${userData.firstName} ${userData.lastName}`);

      // const imagefiles = adServices.extractImageFiles(images);

      const imageUrls = await adServices.uploadImagesToCloudinary(images);
      if (imageUrls.Error) {
        throw new Error(imageUrls.Error);
      }
      console.log("imageUrlsMain:", imageUrls);

      // const imagesUrl = imageUrls.length > 0 ? imageUrls : "";

      const data = {
        userId: 1,
        price,
        description,
        title,
        city,
        adStreetAddress,
        brand,
        images: imageUrls,
        firstName: `${userData.firstName}`,
        lastName: `${userData.lastName}`,
      };

      console.log("data:", data);

      const ad = await adServices.createAd(data);
      console.log("ad:", ad);

      return res.json({ success: true, ad });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
  };
}

module.exports = adController;
