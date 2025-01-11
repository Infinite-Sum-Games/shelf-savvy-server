import { db } from "@src/app";
import { Request, Response } from "express";
import { VGetUserInventory, VAddItemInventory, VEditInventory, VDeleteInventory } from "@src/types/inventory";

export const GetUserInventory = async (req: Request, res: Response) => {
  const validBody = VGetUserInventory.safeParse(req.body);
  if (!validBody.success) {
    console.log(validBody.error);
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    const inventory = await db.inventory.findMany({
      where: {
        email: validBody.data.email,
      },
      select: {
        id: true,
        itemName: true,
        qty: true,
      },
    });

    res.status(200).json({
      message: "Sending user inventory",
      inventory: inventory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const AddItemToInventory = async (req: Request, res: Response) => {
  const validBody = VAddItemInventory.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    const newItem = await db.inventory.create({
      data: {
        email: validBody.data.email,
        itemName: validBody.data.itemName,
        qty: validBody.data.qty,
      },
    });
    res.status(200).json({
      id: newItem.id,
      itemName: newItem.itemName,
      qty: newItem.qty,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const EditInventoryItem = async (req: Request, res: Response) => {
  const validBody = VEditInventory.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    const updateItem = await db.inventory.update({
      data: {
        itemName: validBody.data.itemName,
        qty: validBody.data.qty,
      },
      where: {
        id: validBody.data.id,
      },
    });
    res.status(200).json({
      message: "Item updated successfully",
      itemName: updateItem.itemName,
      qty: updateItem.qty,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const DeleteInventoryItem = async (req: Request, res: Response) => {
  const validBody = VDeleteInventory.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    await db.inventory.delete({
      where: {
        id: validBody.data.id,
        email: validBody.data.email,
      },
    });
    res.status(200).json({
      message: "Delete confirm",
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
