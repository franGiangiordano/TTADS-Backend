import { Request, Response } from 'express';
import userModel from "../models/user";
import bcryptjs from "bcryptjs";

const encrypt = async (passwordPlain: string): Promise<string> => {
    const hash = await bcryptjs.hash(passwordPlain, 10);
    return hash;
};

const getUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1; 
    const perPage = parseInt(req.query.limit as string) || 10; 
    try {
        const totalUsers = await userModel.countDocuments(); 
        const totalPages = Math.ceil(totalUsers / perPage);
        const startIndex = (page - 1) * perPage;
        const users = await userModel.find().skip(startIndex).limit(perPage);
        return res.json({users, totalPages, currentPage: page, totalUsers});
    } catch (error) {
        return res.status(500).json({error: 'No se obtuvo la lista de usuarios'});
    }
}

const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const data = await userModel.findById(id)
        if(!data){
            return res.status(404).json({ error: 'ID no encontrado' });
        }
        return res.status(200).json(data);
        }catch (error) {
            return res.status(500).json({error: 'No se obtuvo el usuario con ese id'});
    }       
};

const createUser = async (req: Request, res: Response) => {
    try {
        const password = await encrypt(req.body.password);
        const body = { ...req.body, password: password };
        const data = await userModel.create(body);
        //eliminar el campo "password" del objeto data antes de enviarlo como respuesta al cliente por seguridad
        data.set('password', undefined, {strict: false});
        res.send({data});
    } catch (error) {
        const existingUser = await userModel.findOne({$or: [{ name: req.body.name }, { email: req.body.email }] });
        if (existingUser) {
            return res.status(409).json({error: 'El usuario/email ya existe'});
        }
        return res.status(500).json({error: 'No se creo el usuario'});
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const updateData = { ...req.body }
        // Encriptar la nueva contraseña 
        if (updateData.password) {
            updateData.password = await encrypt(updateData.password);
        }
        const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(200).json(updatedUser);
        }
        // Ocultar la contraseña en la respuesta
        updatedUser.set('password', undefined, { strict: false });
        res.send({ user: updatedUser });
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            if (error.code === 11000) {
              return res.status(409).json({error: 'El usuario/email ya existe'});
            }
          }
        return res.status(500).json({error: 'No se edito el usuario'});
    }
}

const deleteUser = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await userModel.deleteOne({ _id: id });
        res.send({ data });
    } catch (error) {
        return res.status(500).json({error: 'No se elimino el usuario'});
    }
}

export { getUsers, getUser, createUser, updateUser, deleteUser };