import { generate } from "otp-generator";

export const generateOTP = (): string => {
  return generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};
