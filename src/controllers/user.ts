import { Request, Response } from 'express';
import User from "../models/user";
import Role from "../models/role";

import bcryptjs from "bcryptjs";
import { EntityListResponse } from '../models/entity.list.response.model';

const encrypt = async (passwordPlain: string): Promise<string> => {
    const hash = await bcryptjs.hash(passwordPlain, 10);
    return hash;
};

const getUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.limit as string) || 10;
    try {
        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / perPage);
        const startIndex = (page - 1) * perPage;
        const users = await User.find({}, { password: 0 }).skip(startIndex).limit(perPage);
        return res.json(new EntityListResponse(users, totalUsers, page, totalPages));
    } catch (error) {
        return res.status(500).json({ message: 'No se obtuvo la lista de usuarios' });
    }
}

const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const data = await User.findById(id, { password: 0 }).populate(
            "roles"
        );

        if (!data) {
            return res.status(404).json({ message: 'ID no encontrado' });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: 'No se obtuvo el usuario con ese id' });
    }
};
const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, roles } = req.body;
        const rolesFound = await Role.find({ name: { $in: req.body.roles } });

        const user = new User({
            name,
            email,
            password,
            roles: rolesFound.map((role) => role._id),
        });

        user.password = await User.encryptPassword(user.password);

        const data = await user.save();
        //eliminar el campo "password" del objeto data antes de enviarlo como respuesta al cliente por seguridad
        data.set('password', undefined, { strict: false });
        res.send({ data });
    } catch (error) {
        const existingUser = await User.findOne({ $or: [{ name: req.body.name }, { email: req.body.email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'El usuario/email ya existe' });
        }
        return res.status(500).json({ message: 'No se creo el usuario' });
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
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(200).json(updatedUser);
        }
        // Ocultar la contraseña en la respuesta
        updatedUser.set('password', undefined, { strict: false });
        res.send({ user: updatedUser });
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            if (error.code === 11000) {
                return res.status(409).json({ message: 'El usuario/email ya existe' });
            }
        }
        return res.status(500).json({ message: 'No se edito el usuario' });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await User.deleteOne({ _id: id });
        res.send({ data });
    } catch (error) {
        return res.status(500).json({ message: 'No se elimino el usuario' });
    }
}

export { getUsers, getUser, createUser, updateUser, deleteUser };