import { Request, Response } from "express";
import Equipment from "../models/equipment";
import Driver from "../models/driver";
import Batea from "../models/batea";
import Trailer from "../models/trailer";
import { EntityListResponse } from "../models/entity.list.response.model";

const createEquipment = async (req: Request, res: Response) => {
    try {
      const { description, until_date, driver, batea, trailer } = req.body;

      const driverFound = await Driver.findOne({ legajo: driver });
      const bateaFound = await Batea.findOne({ patent: batea});
      const trailerFound =  await Trailer.findOne({ patent: trailer });  
      
      if (!driverFound) {
        return res.status(404).json({ message: "Driver no encontrado" });
      }
    
      if (!bateaFound) {
        return res.status(404).json({ message: "Batea no encontrada" });
      }
  
      if (!trailerFound) {
        return res.status(404).json({ message: "Trailer no encontrado" });
      }

      const equipmentSaved = await Equipment.create({description: description, until_date: until_date, driver: driverFound._id, trailer: trailerFound._id, batea: bateaFound._id});
      
      return res.status(201).json(equipmentSaved);      
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        if (error.code === 11000) {
          return res.status(409).json({ message: "El equipo ingresado ya existe" });
        }
      }
  
      return res.status(500).json({ message: "No se pudo crear el equipo" });
    }
};

const getEquipments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.limit as string) || 10;

    const search = req.query.search as string || '';
    const searchOptions = { description: { $regex: search, $options: 'i' } }

    const totalEquipments = await Equipment.countDocuments(search != '' ? searchOptions : {});
    const totalPages = Math.ceil(totalEquipments / perPage);
    const startIndex = (page - 1) * perPage;
    
    const equipments = await Equipment.find(search != '' ? searchOptions : {}).populate("driver").populate("batea").populate("trailer");

    return res.json(
      new EntityListResponse(equipments, totalEquipments, startIndex, totalPages)
    );
  } catch (error) {
    return res.status(500).json({ message: "No se pudo obtener los equipos" });
  }
};

const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const { equipmentId } = req.params;
    const equipment = await Equipment.findById(equipmentId).populate("driver").populate("batea").populate("trailer");

    if (!equipment) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    return res.status(200).json(equipment);
  } catch (error) {
    return res.status(500).json({ message: "No se pudo obtener el equipo" });
  }
};

const updateEquipmentById = async (req: Request, res: Response) => {
  try {
    const { equipmentId } = req.params;

    const { description, until_date, driver, batea, trailer } = req.body;

    const driverFound = await Driver.findOne({ legajo: driver });
    const bateaFound = await Batea.findOne({ patent: batea});
    const trailerFound = await Trailer.findOne({ patent: trailer});

    if (!driverFound) {
      return res.status(404).json({ message: "Driver no encontrado" });
    }

    if (!bateaFound) {
      return res.status(404).json({ message: "Batea no encontrada" });
    }

    if (!trailerFound) {
      return res.status(404).json({ message: "Trailer no encontrado" });
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(equipmentId, {
      description: description,
      until_date: until_date,
      driver: driverFound._id,
      batea: bateaFound._id,
      trailer: trailerFound._id
    }, { new: true });

    if (!updatedEquipment) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    return res.status(200).json(updatedEquipment);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "El equipo ya existe" });
      }
    }
    console.log(error);
    return res.status(500).json({ message: "No se pudo actualizar el equipo" });
  }
};

const deleteEquipmentById = async (req: Request, res: Response) => {
  try {
    const { equipmentId } = req.params;

    const deletedEquipment = await Equipment.findByIdAndDelete(equipmentId);

    if (!deletedEquipment) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    return res.status(200).json({ message: "Equipo eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "No se pudo eliminar el equipo" });
  }
};


export {createEquipment,getEquipments,getEquipmentById,updateEquipmentById,deleteEquipmentById};