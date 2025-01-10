import z from "zod";

export const VGetUserInventory = z.object({
  email: z.string().trim().email(),
});

export const VAddItemInventory = z.object({
  email: z.string().trim().email(),
  itemName: z.string().trim().min(3).max(50),
  qty: z.number().int().nonnegative(),
});

export const VEditInventory = z.object({
  email: z.string().trim().email(),
  id: z.string().trim().cuid(),
  itemName: z.string().trim().min(3).max(50),
  qty: z.number().int().nonnegative(),
});

export const VDeleteInventory = z.object({
  email: z.string().trim().email(),
  id: z.string().trim().cuid(),
});
