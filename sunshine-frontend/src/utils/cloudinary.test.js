import { getOptimizedCloudinaryUrl } from "./cloudinary";

const BASE = "https://res.cloudinary.com/demo/image/upload";

describe("getOptimizedCloudinaryUrl", () => {
  it("returns non-Cloudinary URLs unchanged", () => {
    expect(getOptimizedCloudinaryUrl("https://example.com/a.jpg")).toBe(
      "https://example.com/a.jpg",
    );
  });

  it("injects transformations after /upload/", () => {
    expect(getOptimizedCloudinaryUrl(`${BASE}/v123/pic.jpg`, { width: 400 })).toBe(
      `${BASE}/c_fill,w_400,dpr_auto,q_auto:good,f_auto/v123/pic.jpg`,
    );
  });

  it("replaces existing transformations instead of stacking them", () => {
    expect(getOptimizedCloudinaryUrl(`${BASE}/w_100/v123/pic.jpg`, { width: 400 })).toBe(
      `${BASE}/c_fill,w_400,dpr_auto,q_auto:good,f_auto/v123/pic.jpg`,
    );
  });
});
