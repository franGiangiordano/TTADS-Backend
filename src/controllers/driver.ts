import { Request, Response } from 'express';
import driverModel from "../models/driver";

const getDrivers = async (req: Request, res: Response) => {
    try {
        const data = await driverModel.find({});
        res.send({ data });
    } catch (error) {
        return res.status(500).json({error: 'No se obtuvo la lista de choferes'});
    }
};

const getDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await driverModel.findById(id);
        if(!data){
            return res.status(404).json({ error: 'ID no encontrado' });
        }
        return res.status(200).json(data);
        }catch (error) {
            return res.status(500).json({error: 'No se obtuvo el chofer con ese id'});
    }       
};

const createDriver = async (req: Request, res: Response) => {
    try {
        const existingDriver = await driverModel.findOne({ legajo: req.body.legajo, });
        if (existingDriver) {
            return res.status(409).json({error: 'El legajo ya existe'});
        }
        const data = await driverModel.create(req.body);
        res.send({ data });
    } catch (error) {
        return res.status(500).json({error: 'No se creo el chofer'});
    }
};

const updateDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const data = await driverModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) {
            return res.status(200).json(data);
        }
        res.send({ data });
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            if (error.code === 11000) {
              return res.status(409).json({error: 'El legajo ya existe'});
            }
          }
        return res.status(500).json({error: 'No se edito el chofer'});
    }
};

const deleteDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await driverModel.deleteOne({ _id: id });
        res.send({ data });
    } catch (error) {
        return res.status(500).json({error: 'No se elimino el chofer'});
    }
};

export { getDrivers, getDriver, createDriver, updateDriver, deleteDriver };