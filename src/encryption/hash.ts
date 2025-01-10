import { createHash } from "crypto";

export const newHash = (text: string) => {
  const hash = createHash("sha256").update(text).digest("hex");
  return hash;
};
