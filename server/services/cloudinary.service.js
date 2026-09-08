import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";

class CloudinaryService {
  get cloudName() {
    return process.env.CLOUDINARY_CLOUD_NAME || "";
  }

  get apiKey() {
    return process.env.CLOUDINARY_API_KEY || "";
  }

  get apiSecret() {
    return process.env.CLOUDINARY_API_SECRET || "";
  }

  isConfigured() {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  /**
   * Generates SHA-1 signature for Cloudinary API requests
   */
  generateSignature(paramsToSign) {
    const sortedKeys = Object.keys(paramsToSign).sort();
    const serializedParams = sortedKeys
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");

    return crypto
      .createHash("sha1")
      .update(serializedParams + this.apiSecret)
      .digest("hex");
  }

  /**
   * Extracts public_id from a Cloudinary URL or returns raw public_id
   * e.g. https://res.cloudinary.com/demo/image/upload/v12345/smartnshine/portfolios/pic.png -> "smartnshine/portfolios/pic"
   */
  extractPublicId(urlOrPublicId) {
    if (!urlOrPublicId || typeof urlOrPublicId !== "string") return null;

    if (!urlOrPublicId.includes("cloudinary.com")) {
      // If already a public ID path
      return urlOrPublicId.includes("/") ? urlOrPublicId : null;
    }

    try {
      const cleanUrl = urlOrPublicId.split("?")[0].split("#")[0];
      const uploadIdx = cleanUrl.indexOf("/upload/");
      if (uploadIdx === -1) return null;

      const pathAfterUpload = cleanUrl.substring(uploadIdx + 8);
      const segments = pathAfterUpload.split("/");

      const cleanSegments = [];
      let foundStart = false;

      for (const segment of segments) {
        if (!foundStart) {
          // Skip transformations like c_limit,w_1600,q_auto or version tag like v1741405123
          if (/^v\d+$/.test(segment) || segment.includes(",") || /^[a-z]_[a-z0-9_]+$/i.test(segment)) {
            continue;
          }
          foundStart = true;
        }
        cleanSegments.push(segment);
      }

      const fullPath = cleanSegments.join("/");
      const lastDot = fullPath.lastIndexOf(".");
      return lastDot !== -1 ? fullPath.substring(0, lastDot) : fullPath;
    } catch (err) {
      console.warn("Failed to extract Cloudinary public_id:", err.message);
      return null;
    }
  }

  /**
   * Uploads an image buffer directly to Cloudinary
   * @param {Buffer} buffer - Image file buffer
   * @param {Object} options - Upload options (folder, publicId, etc.)
   */
  async uploadImageBuffer(buffer, options = {}) {
    const { folder = "smartnshine/portfolios", publicId = null } = options;

    if (!this.isConfigured()) {
      throw new Error(
        "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET via the Super Admin Environment Panel."
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      folder,
      timestamp,
      transformation: "c_limit,w_1600,q_auto,f_auto",
    };

    if (publicId) {
      paramsToSign.public_id = publicId;
    }

    const signature = this.generateSignature(paramsToSign);

    const formData = new FormData();
    formData.append("file", buffer, {
      filename: options.originalname || "image.png",
      contentType: options.mimetype || "image/png",
    });
    formData.append("api_key", this.apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", folder);
    formData.append("transformation", "c_limit,w_1600,q_auto,f_auto");
    formData.append("signature", signature);

    if (publicId) {
      formData.append("public_id", publicId);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    const response = await axios.post(uploadUrl, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return {
      success: true,
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
      width: response.data.width,
      height: response.data.height,
      format: response.data.format,
      bytes: response.data.bytes,
    };
  }

  /**
   * Deletes an image from Cloudinary by public ID or URL
   * @param {string} publicIdOrUrl - Cloudinary public_id or image URL
   */
  async deleteImage(publicIdOrUrl) {
    if (!publicIdOrUrl) return { success: false, message: "No image identifier provided" };

    const publicId = this.extractPublicId(publicIdOrUrl);
    if (!publicId) {
      return { success: false, message: "Could not resolve Cloudinary public_id" };
    }

    if (!this.isConfigured()) {
      return { success: false, message: "Cloudinary credentials not configured" };
    }

    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        public_id: publicId,
        timestamp,
      };

      const signature = this.generateSignature(paramsToSign);

      const formData = new FormData();
      formData.append("public_id", publicId);
      formData.append("api_key", this.apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);

      const destroyUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
      const response = await axios.post(destroyUrl, formData, {
        headers: formData.getHeaders(),
      });

      const ok = response.data?.result === "ok";
      if (ok) {
        console.log(`🗑️ [CLOUDINARY] Successfully deleted old image: ${publicId}`);
      } else {
        console.warn(`⚠️ [CLOUDINARY] Destroy result:`, response.data);
      }

      return {
        success: ok,
        result: response.data?.result,
        publicId,
      };
    } catch (error) {
      console.warn(`Failed to delete Cloudinary image (${publicId}):`, error.message);
      return {
        success: false,
        error: error.message,
        publicId,
      };
    }
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
