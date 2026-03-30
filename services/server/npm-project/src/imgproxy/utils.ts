import { generateImageUrl } from "@imgproxy/imgproxy-node";

const KEY_VALUE = "68617368";
const SALT_VALUE = "68617368";
const IMGPROXY_BASE_URL = "/images/";

export function getImgproxyUrl(imageUrl: string) {
  return generateImageUrl({
    endpoint: IMGPROXY_BASE_URL,
    url: imageUrl,
    salt: SALT_VALUE,
    key: KEY_VALUE,
  });
}
