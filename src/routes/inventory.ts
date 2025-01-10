import { Router } from "express";
import { GetUserInventory, AddItemToInventory, EditInventoryItem, DeleteInventoryItem } from "@src/controllers/inventory";
import { authMiddleware } from "@src/middleware/token";

const router = Router();

router.post("/user", authMiddleware, GetUserInventory);
router.post("/", authMiddleware, AddItemToInventory);
router.put("/", authMiddleware, EditInventoryItem);
router.delete("/", authMiddleware, DeleteInventoryItem);

export { router as InventoryRouter };
