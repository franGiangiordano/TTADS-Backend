import { Request, Response } from 'express';
import driverModel from "../models/driver";

const getDrivers = async (req: Request, res: Response) => {
    try {
        const data = await driverModel.find({});
        res.send({ data });
    } catch (error) {
        return res.status(500).json({error: ' Error getDrivers'});
    }
};

const createDriver = async (req: Request, res: Response) => {
    try {
        const existingDriver = await driverModel.findOne({ legajo: req.body.legajo, });
        if (existingDriver) {
            return res.status(409).json({error: 'Driver with the same legajo already exists'});
        }

        const data = await driverModel.create(req.body);
        res.send({ data });
    } catch (error) {
        return res.status(500).json({error: ' Error CreateDriver'});
    }
};

const getDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await driverModel.findById(id);
        res.send({ data });
    } catch (error) {
        return res.status(500).json({error: ' Error getDriver'});
    }
};

const updateDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        //excluyo el id del conductor para que pueda modificarse a si mismo
        const existingDriverWithSameLegajo = await driverModel.findOne({$and: [{ _id: { $ne: id } }, { legajo: req.body.legajo }]});
        
        if (existingDriverWithSameLegajo) {
            return res.status(409).json({error: 'Driver with the same legajo already exists'});
        }
        
        const data = await driverModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) {
            return res.status(500).json({ error: 'Error Update failed' });
        }

        res.send({ data });
    } catch (error) {
        return res.status(500).json({ error: 'Error updateDriver' });
    }
};

const deleteDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await driverModel.deleteOne({ _id: id });
        res.send({ data });
    } catch (error) {
        return res.status(500).json({error: 'Error deleteDriver'});
    }
};

export { getDrivers, getDriver, createDriver, updateDriver, deleteDriver };