const CLOUDINARY_HOST = "res.cloudinary.com";
const UPLOAD_SEGMENT = "/upload/";

const hasVersionSegment = (segment) => /^v\d+$/.test(segment);

const stripVersionedTransformations = (pathAfterUpload) => {
  const segments = pathAfterUpload.split("/");
  const versionIndex = segments.findIndex(hasVersionSegment);

  if (versionIndex <= 0) {
    return pathAfterUpload;
  }

  return segments.slice(versionIndex).join("/");
};

export const getOptimizedCloudinaryUrl = (url, options = {}) => {
  if (
    typeof url !== "string" ||
    !url.includes(CLOUDINARY_HOST) ||
    !url.includes(UPLOAD_SEGMENT)
  ) {
    return url;
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto:good",
    format = "auto",
    dpr = "auto",
  } = options;

  const transformations = [];

  if (crop) transformations.push(`c_${crop}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (dpr) transformations.push(`dpr_${dpr}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  if (!transformations.length) {
    return url;
  }

  const [prefix, suffixRaw] = url.split(UPLOAD_SEGMENT);
  const suffix = stripVersionedTransformations(suffixRaw);

  return `${prefix}${UPLOAD_SEGMENT}${transformations.join(",")}/${suffix}`;
};