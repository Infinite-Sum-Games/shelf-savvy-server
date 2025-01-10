import z from "zod";

export const VUserRegistration = z.object({
  firstName: z
    .string()
    .trim()
    .min(1)
    .max(30)
    .regex(/^[a-zA-Z]+$/),
  lastName: z
    .string()
    .trim()
    .min(1)
    .max(30)
    .regex(/^[a-zA-Z]+$/),
  email: z.string().trim().max(320).email(),
  username: z
    .string()
    .trim()
    .min(5)
    .max(32)
    .regex(/^[a-zA-Z0-9_.]+$/),
  password: z
    .string()
    .trim()
    .min(8)
    .max(30)
    .regex(/^[a-zA-Z0-9]*$/),
});

export const VUserLogin = z.object({
  username: z
    .string()
    .trim()
    .min(5)
    .regex(/^[a-zA-Z0-9_.]+$/),
  password: z.string().min(8).max(30).regex(new RegExp("^[a-zA-Z0-9_]*$")),
});

export const VUserRegistrationOTP = z.object({
  username: z
    .string()
    .trim()
    .min(5)
    .regex(/^[a-zA-Z0-9_.]+$/),
  email: z.string().trim().email(),
  otp: z
    .string()
    .trim()
    .length(6)
    .regex(/^[0-9]+$/),
});

export const VBankLogin = z.object({
  bankname: z
    .string()
    .trim()
    .min(5)
    .regex(/^[a-zA-Z0-9_.]+$/),
  password: z.string().min(8).max(30).regex(new RegExp("^[a-zA-Z0-9_]*$")),
});

export const VBankRegistration = z.object({
  bankname: z
    .string()
    .trim()
    .min(5)
    .regex(/^[a-zA-Z0-9_.]+$/),
  password: z.string().min(8).max(30).regex(new RegExp("^[a-zA-Z0-9_]*$")),
  email: z.string().trim().email(),
});

export const VBankRegistrationOTP = z.object({
  bankname: z
    .string()
    .trim()
    .min(5)
    .regex(/^[a-zA-Z0-9_.]+$/),
  email: z.string().trim().email(),
  otp: z
    .string()
    .trim()
    .length(6)
    .regex(/^[0-9]+$/),
});

export const VCheckBankUsername = z.object({
  bankname: z
    .string()
    .trim()
    .min(5)
    .regex(/^[a-zA-Z0-9_.]+$/),
});

export const VCheckUsername = z.object({
  username: z
    .string()
    .trim()
    .min(5)
    .regex(/^[a-zA-Z0-9_.]+$/),
});
