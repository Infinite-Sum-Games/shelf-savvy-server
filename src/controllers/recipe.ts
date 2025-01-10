import { db } from "@src/app";
import { VCreateNewRecipe, VDeleteRecipe, VEditRecipe } from "@src/types/recipe";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { CustomError } from "@src/middleware/errors";

export const CreateNewRecipeHandler = async (req: Request, res: Response) => {
  const validBody = VCreateNewRecipe.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    await db.$transaction(async (tx) => {
      const findUser = await tx.user.findFirst({
        where: {
          email: validBody.data.email,
        },
        select: {
          id: true,
        },
      });
      if (!findUser) {
        throw new CustomError(403, "");
      }

      const newRecipe = await tx.recipe.create({
        data: {
          userId: findUser.id,
          title: validBody.data.title,
          content: validBody.data.content,
          ingredients: validBody.data.ingredients,
        },
      });
      if (!newRecipe) {
        throw new CustomError(500, "Could not create new recipe")
      }

      res.status(200).json({
        message: "New Recipe Added",
        title: newRecipe.title,
        content: newRecipe.content,
        ingredients: newRecipe.ingredients,
      });
      return;
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        message: error.message
      });
      return;
    }
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

// TODO: If possible
// export const RefreshRecipeHandler = async (req: Request, res: Response) => { };

export const EditRecipeHandler = async (req: Request, res: Response) => {
  const validBody = VEditRecipe.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {

    })
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const DeleteRecipeHandler = async (req: Request, res: Response) => {
  const validBody = VDeleteRecipe.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const findUser = await tx.user.findFirst({
        where: {
          email: validBody.data.email,
        },
      });
      if (!findUser) {
        throw new CustomError(404, "User not found");
      }

      await tx.recipe.delete({
        where: {
          userId: findUser.id,
          id: validBody.data.recipeId,
        },
      });
    });

    res.status(200).json({
      message: "Successfully deleted item"
    });
    return;
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
