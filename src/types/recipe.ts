import z from "zod";

export const VRefreshRecipe = z.object({
  email: z.string().trim().max(320).email(),
});

export const VCreateNewRecipe = z.object({
  email: z.string().trim().max(320).email(),
  title: z.string().trim().min(10).max(120),
  ingredients: z.array(z.string()),
  content: z.string(),
});

export const VEditRecipe = z.object({
  email: z.string().trim().max(320).email(),
  recipeId: z.string().trim().cuid(),
  title: z.string().trim().min(10).max(120),
  ingredients: z.array(z.string()),
  content: z.string(),
});

export const VDeleteRecipe = z.object({
  email: z.string().trim().max(320).email(),
  recipeId: z.string().cuid(),
});

export const VGetPopularRecipe = z.object({
  email: z.string().trim().max(320).email(),
});
