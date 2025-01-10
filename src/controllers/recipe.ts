import { db } from "@src/app";
import { VCreateNewRecipe, VDeleteRecipe, VGetPopularRecipe } from "@src/types/recipe";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { CustomError } from "@src/middleware/errors";

export const CreateNewRecipeHandler = async (req: Request, res: Response) => {
  const validBody = VCreateNewRecipe.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request"
    });
    return;
  }

  await db.$transaction(async (tx) => {
    const findUser = await tx.user.findFirst({
      where: {
        email: validBody.data.email
      },
      select: {
        id: true
      }
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
      }
    });
    if (!newRecipe) {

    }

    res.status(200).json({
      message: "New Recipe Added"
    });
    return;
  });

  await db.$transaction(async (tx: Prisma.TransactionClient) => {

  })
};

const RefreshRecipeHandler = async (req: Request, res: Response) => { };


const EditRecipeHandler = async (req: Request, res: Response) => { };

const DeleteRecipeHandler = async (req: Request, res: Response) => {
  const validBody = VDeleteRecipe.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request"
    })
    return;
  }

  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const findUser = await db.user.findFirst({
      where: {
        email: validBody.data.email,
      }
    });
    const confirmDelete = await db.recipe.delete({
      where: {
        userId: findUser.id,
        id: validBody.data.recipeId,
      }
    });
  });
};

const GetPopularRecipe = async (req: Request, res: Response) => {
  const validBody = VGetPopularRecipe.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request"
    });
    return;
  }
};
