import {
  CreateNewRecipeHandler,
  DeleteRecipeHandler,
  EditRecipeHandler,
} from "@src/controllers/recipe";
import { Router } from "express";

const router = Router();

router.post("/new", CreateNewRecipeHandler);
router.post("/edit", EditRecipeHandler);
router.post("/delete", DeleteRecipeHandler);

export { router as RecipeRouter };
