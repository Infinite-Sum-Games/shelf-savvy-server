import { Router } from "express";
import {
  GetUserInventory,
  AddItemToInventory,
  EditInventoryItem,
  DeleteInventoryItem,
} from "@src/controllers/inventory";

const router = Router();

router.post("/user", GetUserInventory);
router.post("/", AddItemToInventory);
router.put("/", EditInventoryItem);
router.delete("/", DeleteInventoryItem);

export { router as InventoryRouter };
