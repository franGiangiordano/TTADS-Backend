import { Request, Response } from "express";
import Travel from "../models/travel";
import Equipment from "../models/equipment";
import Repair from "../models/repair";
import { EntityListResponse } from "../models/entity.list.response.model";

const createTravel = async (req: Request, res: Response) => {
    try {
      const { departure_date, arrival_date, cost, km, starting_location, final_location, equipment, destination_description } = req.body;
      const equipmentFound = await Equipment.findOne({ _id: equipment });      
      
      
      if (!equipmentFound) {
        return res.status(404).json({ message: "Equipo no encontrado" });
      }

      const existingTravel = await Travel.findOne({
        departure_date: { $lte: arrival_date },
        arrival_date: { $gte: departure_date },
        equipment: equipmentFound._id,
      });

      if (existingTravel) {
        return res.status(409).json({ message: "El chofer ya tiene un viaje en esa fecha" });
      }

      const existingRepair = await Repair.findOne({
        equipment: equipmentFound._id,
        createdAt: {
          $gte: new Date(departure_date).setHours(0, 0, 0, 0),
          $lte: new Date(arrival_date).setHours(23, 59, 59, 999)
        }
      })

      if (existingRepair) {
        return res.status(409).json({ message: "El equipo tiene una reparacion programada para esa fecha" });
      }

      const travelSaved = await Travel.create({
        departure_date: departure_date,
        arrival_date:arrival_date,
        cost:cost,
        km: km,
        starting_location: starting_location,
        final_location: final_location,
        equipment: equipmentFound,
        destination_description: destination_description
      });
      
      return res.status(201).json(travelSaved);      
    } catch (error) {
      console.log(error);
      if (typeof error === "object" && error !== null && "code" in error) {
        if (error.code === 11000) {
          return res.status(409).json({ message: "El viaje ingresado ya existe" });
        }
      }
  
      return res.status(500).json({ message: "No se pudo crear el viaje" });
    }
};

const getTravels = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.limit as string) || 10;
  
      const search = req.query.search as string || '';
      const query: any = {};

      if (search) {
        query.$or = [
          { starting_location: { $regex: search, $options: 'i' } },
          { final_location: { $regex: search, $options: 'i' } },   
          { destination_description: { $regex: search, $options: 'i' } },    
        ];
      }
  
      const totalTravels = await Travel.countDocuments(query);
      const totalPages = Math.ceil(totalTravels / perPage);
      const startIndex = (page - 1) * perPage;
      
      const travels = await Travel.find(query).populate({
        path: 'equipment',
        populate: [{
          path: 'batea',
          model: 'Batea',  
        },
        {
          path: 'driver',
          model: 'Driver',  
          select: 'legajo name surname', 
        },
        {
            path: 'trailer',
            model: 'Trailer',  
            select: 'patent type', 
        }
        ]
      });
      return res.json(
        new EntityListResponse(travels, totalTravels, startIndex, totalPages)
      );
    } catch (error) {
      return res.status(500).json({ message: "No se pudo obtener los viajes" });
    }
};

const getTravelById = async (req: Request, res: Response) => {
    try {
      const { travelId } = req.params;
      const travel = await Travel.findById(travelId).populate({
        path: 'equipment',
        populate: [{
          path: 'batea',
          model: 'Batea',  
        },
        {
          path: 'driver',
          model: 'Driver',  
          select: 'legajo name surname', 
        },
        {
            path: 'trailer',
            model: 'Trailer',  
            select: 'patent type', 
        }
        ]
      });
  
      if (!travel) {
        return res.status(404).json({ message: "Viaje no encontrado" });
      }
  
      return res.status(200).json(travel);
    } catch (error) {
      return res.status(500).json({ message: "No se pudo obtener el viaje" });
    }
};

const updateTravelById = async (req: Request, res: Response) => {
    try {
      const { travelId } = req.params;
      const { departure_date, arrival_date, cost, km, starting_location, final_location, equipment, destination_description } = req.body;

      const equipmentFound = await Equipment.findOne({ _id: equipment });
  
      if (!equipmentFound) {
        return res.status(404).json({ message: "Equipo no encontrado" });
      }

      const existingTravel = await Travel.findOne({
        _id: { $ne: travelId },
        equipment: equipmentFound._id,
        departure_date: { $lte: arrival_date },
        arrival_date: { $gte: departure_date },
      });
  
      if (existingTravel) {
        return res.status(409).json({ message: "El chofer ya tiene un viaje en esa fecha" });
      }
      
      const updatedTravel = await Travel.findByIdAndUpdate(travelId, {
        departure_date: departure_date,
        arrival_date:arrival_date,
        cost:cost,
        km: km,
        starting_location: starting_location,
        final_location: final_location,
        equipment: equipmentFound,
        destination_description: destination_description
      }, { new: true });
  
      if (!updatedTravel) {
        return res.status(404).json({ message: "Viaje no encontrado" });
      }
  
      return res.status(200).json(updatedTravel);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        if (error.code === 11000) {
          return res.status(409).json({ message: "El viaje ya existe" });
        }
      }
      console.log(error);
      return res.status(500).json({ message: "No se pudo actualizar el viaje" });
    }
};

const deleteTravelById = async (req: Request, res: Response) => {
    try {
      const { travelId } = req.params;

      const deletedTravel = await Travel.findByIdAndDelete(travelId);
  
      if (!deletedTravel) {
        return res.status(404).json({ message: "Viaje no encontrado" });
      }
  
      return res.status(200).json({ message: "Viaje eliminado correctamente" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "No se pudo eliminar el viaje" });
    }
};

export {createTravel,getTravels,getTravelById,updateTravelById,deleteTravelById};