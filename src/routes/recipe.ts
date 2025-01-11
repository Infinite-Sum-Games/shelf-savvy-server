import {
  CreateNewRecipeHandler,
  DeleteRecipeHandler,
  EditRecipeHandler,
  GetAllRecipeHandler,
} from "@src/controllers/recipe";
import { Router } from "express";

const router = Router();

router.post("/all", GetAllRecipeHandler);
router.post("/new", CreateNewRecipeHandler);
router.post("/edit", EditRecipeHandler);
router.post("/delete", DeleteRecipeHandler);

export { router as RecipeRouter };
