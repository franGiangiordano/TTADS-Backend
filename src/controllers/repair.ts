import Reparacion from '../models/repair';
import Equipment from '../models/equipment';
import { Request, Response } from 'express';

const createRepair = async (req: Request, res: Response) => {
  try {
    const { description, cost, equipment } = req.body;
    const equipmentFound = await Equipment.findOne({ _id: equipment });      
    
    if (!equipmentFound) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    const repair = await Reparacion.create({
      description:description,
      cost:cost,
      equipment: equipmentFound,
    });
    
    return res.status(201).json(repair);      
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "La Reparación ingresada ya existe" });
      }
    }
    return res.status(500).json({ message: "No se pudo crear la Reparación" });
  }
};

const getRepairs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.limit as string) || 10;

    const search = req.query.search as string || '';
    const searchOptions = { description: { $regex: search, $options: 'i' } };

    const totalRepairs = await Reparacion.countDocuments(search !== '' ? searchOptions : {});
    const totalPages = Math.ceil(totalRepairs / perPage);
    const startIndex = (page - 1) * perPage;

    const repairs = await Reparacion.find(search !== '' ? searchOptions : {})
      .populate('equipment');

    return res.json({
      results: repairs,
      total: totalRepairs,
      startIndex: startIndex,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'No se pudo obtener las reparaciones' });
  }
};

const getRepairById = async (req: Request, res: Response) => {
    try {
      const { repairId } = req.params;
      const repair = await Reparacion.findById(repairId).populate('equipment');
  
      if (!repair) {
        return res.status(404).json({ message: 'Reparación no encontrada' });
      }
  
      return res.status(200).json(repair);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'No se pudo obtener la reparación' });
    }
  };

  const updateRepair = async (req: Request, res: Response) => {
    try {
      const { repairId } = req.params;
      const { description, cost } = req.body;
  
      const updatedRepair = await Reparacion.findByIdAndUpdate(
        repairId,
        { description, cost },
        { new: true }
      );
  
      if (!updatedRepair) {
        return res.status(404).json({ message: 'Reparación no encontrada' });
      }
  
      return res.status(200).json(updatedRepair);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'No se pudo actualizar la reparación' });
    }
  };

  const deleteRepair = async (req: Request, res: Response) => {
    try {
      const { repairId } = req.params;
  
      const deletedRepair = await Reparacion.findByIdAndDelete(repairId);
  
      if (!deletedRepair) {
        return res.status(404).json({ message: 'Reparación no encontrada' });
      }
  
      return res.status(200).json({ message: 'Reparación eliminada correctamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'No se pudo eliminar la reparación' });
    }
  };

export {createRepair, getRepairs, getRepairById, updateRepair, deleteRepair};