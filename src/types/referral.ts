import z from "zod";

export const VEnterReferral = z.object({
  email: z.string().trim().email(),
  referralCode: z.string().trim(),
});
