import { writeFileSync } from "fs";
import { generateKeyPairSync } from "crypto";

const generateKey = () => {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  writeFileSync("./public_key.pem", publicKey.toString());
  writeFileSync("./private_key.pem", privateKey.toString());
};

generateKey();
