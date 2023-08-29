import { Request, Response } from 'express';
import driverModel from "../models/driver";

const getDrivers = async (req: Request, res: Response) => {
    try {
        const data = await driverModel.find({});
        res.send({ data });
    } catch (error) {
        return res.status(500).json(error);
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
            console.log(error);
            return res.status(500).json(error);
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
        return res.status(500).json(error);
    }
};

const updateDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        //excluyo el id del conductor para que pueda modificarse a si mismo
        const existingDriverWithSameLegajo = await driverModel.findOne({$and: [{ _id: { $ne: id } }, { legajo: req.body.legajo }]});
        
        if (existingDriverWithSameLegajo) {
            return res.status(409).json({error: 'El legajo ya existe'});
        }
        
        const data = await driverModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) {
            return res.status(200).json(data);
        }
        res.send({ data });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await driverModel.deleteOne({ _id: id });
        res.send({ data });
    } catch (error) {
        return res.status(500).json(error);
    }
};

export { getDrivers, getDriver, createDriver, updateDriver, deleteDriver };