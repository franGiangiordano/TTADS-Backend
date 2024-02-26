import { Request, Response } from "express";
import Batea from "../models/batea";
import Equipment from "../models/equipment";
import { EntityListResponse } from "../models/entity.list.response.model";

const createBatea = async (req: Request, res: Response) => {
  try {
    const bateaSaved = await Batea.create(req.body);
    return res.status(201).json(bateaSaved);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "La patente ya existe" });
      }
    }

    return res.status(500).json({ message: "No se pudo crear la batea" });
  }
};

const getBateaById = async (req: Request, res: Response) => {
  const { bateaId } = req.params;

  try {
    const batea = await Batea.findById(bateaId);
    if (!batea) {
      return res.status(404).json({ message: "ID no encontrado" });
    }
    return res.status(200).json(batea);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al intentar recuperar la batea" });
  }
};

const getBateas = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.limit as string) || 10;

  const search = (req.query.search as string) || "";
  const searchOptions = { patent: { $regex: search, $options: "i" } };

  try {
    const totalBateas = await Batea.countDocuments(
      search != "" ? searchOptions : {}
    );
    const totalPages = Math.ceil(totalBateas / perPage);

    const startIndex = (page - 1) * perPage;

    const bateas = await Batea.find(search != "" ? searchOptions : {})
      .skip(startIndex)
      .limit(perPage);

    return res.json(
      new EntityListResponse(bateas, totalBateas, startIndex, totalPages)
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "No se obtuvo la lista de bateas" });
  }
};

const updatebateaById = async (req: Request, res: Response) => {
  try {
    const updatedbatea = await Batea.findByIdAndUpdate(
      req.params.bateaId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedbatea) {
      return res.status(404).json({ message: "ID no encontrado" });
    }
    return res.status(200).json(updatedbatea);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "La patente ya existe" });
      }
    }

    return res.status(500).json({ message: "No se pudo editar la batea" });
  }
};

const deletebateaById = async (req: Request, res: Response) => {
  const { bateaId } = req.params;

  try {
    const equipment = await Equipment.findOne({ batea: bateaId });
    if (equipment) {
      return res
        .status(400)
        .json({
          message: "La batea forma parte de un equipo, no se puede eliminar",
        });
    }

    const result = await Batea.findByIdAndDelete(bateaId);
    if (!result) {
      return res.status(404).json({ message: "ID no encontrado" });
    }

    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "No se pudo eliminar la batea" });
  }
};

export {
  createBatea,
  getBateaById,
  getBateas,
  updatebateaById,
  deletebateaById,
};
