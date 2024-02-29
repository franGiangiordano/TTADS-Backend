import Reparacion from "../models/repair";
import Equipment from "../models/equipment";
import { Request, Response } from "express";
import Repair from "../models/repair";
import { EntityListResponse } from "../models/entity.list.response.model";
import Travel from "../models/travel";
import { kMaxLength } from "buffer";

const createRepair = async (req: Request, res: Response) => {
  try {
    const { description, cost, equipment, km } = req.body;
    const equipmentFound = await Equipment.findOne({ _id: equipment });

    if (!equipmentFound) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    const currentDate = new Date().setHours(0, 0, 0, 0);

    const existingTravel = await Travel.findOne({
      equipment: equipmentFound._id,
      departure_date: { $lte: currentDate },
      arrival_date: { $gte: currentDate },
    });

    if (existingTravel) {
      return res.status(409).json({
        message:
          "No es posible ingresar la reparacion porque el equipo se encuentra en un viaje",
      });
    }

    const repair = await Reparacion.create({
      description: description,
      cost: cost,
      equipment: equipmentFound,
      km: km,
    });

    return res.status(201).json(repair);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res
          .status(409)
          .json({ message: "La Reparación ingresada ya existe" });
      }
    }
    return res.status(500).json({ message: "No se pudo crear la Reparación" });
  }
};

const getRepairs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.limit as string) || 10;

    const search = (req.query.search as string) || "";
    const query: any = {};

    if (search) {
      query.$or = [{ description: { $regex: search, $options: "i" } }];
    }

    const totalRepairs = await Repair.countDocuments(query);
    const totalPages = Math.ceil(totalRepairs / perPage);
    const startIndex = (page - 1) * perPage;

    const repairs = await Repair.find(query)
      .populate({
        path: "equipment",
        populate: [
          {
            path: "batea",
            model: "Batea",
          },
          {
            path: "driver",
            model: "Driver",
            select: "legajo name surname",
          },
          {
            path: "trailer",
            model: "Trailer",
            select: "patent type",
          },
        ],
      })
      .skip(startIndex)
      .limit(perPage);

    return res.json(
      new EntityListResponse(repairs, totalRepairs, startIndex, totalPages)
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "No se pudo obtener las reparaciones" });
  }
};

const getRepairById = async (req: Request, res: Response) => {
  try {
    const { repairId } = req.params;
    const repair = await Repair.findById(repairId).populate({
      path: "equipment",
      populate: [
        {
          path: "batea",
          model: "Batea",
        },
        {
          path: "driver",
          model: "Driver",
          select: "legajo name surname",
        },
        {
          path: "trailer",
          model: "Trailer",
          select: "patent type",
        },
      ],
    });

    if (!repair) {
      return res.status(404).json({ message: "Reparación no encontrada" });
    }

    return res.status(200).json(repair);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "No se pudo obtener la Reparación" });
  }
};

const updateRepair = async (req: Request, res: Response) => {
  try {
    const { repairId } = req.params;
    const { description, cost, equipment, km } = req.body;

    const equipmentFound = await Equipment.findOne({ _id: equipment });

    if (!equipmentFound) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    const updatedRepair = await Reparacion.findByIdAndUpdate(
      repairId,
      {
        description: description,
        cost: cost,
        equipment: equipmentFound,
        km: km,
      },
      { new: true }
    );

    if (!updatedRepair) {
      return res.status(404).json({ message: "Reparación no encontrada" });
    }

    return res.status(200).json(updatedRepair);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "La Reparación ya existe" });
      }
    }
    console.log(error);
    return res
      .status(500)
      .json({ message: "No se pudo actualizar la Reparación" });
  }
};

const deleteRepair = async (req: Request, res: Response) => {
  try {
    const { repairId } = req.params;

    const deletedRepair = await Reparacion.findByIdAndDelete(repairId);

    if (!deletedRepair) {
      return res.status(404).json({ message: "Reparación no encontrada" });
    }

    return res
      .status(200)
      .json({ message: "Reparación eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "No se pudo eliminar la reparación" });
  }
};

export { createRepair, getRepairs, getRepairById, updateRepair, deleteRepair };
