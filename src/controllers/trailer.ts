import { Request, Response } from "express";
import Trailer from "../models/trailer";

const getTrailers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.limit as string) || 10;

  const search = req.query.search as string || '';
  const searchOptions = {
    $or: [
      { patent: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } },     
    ],
  }

  try {
    const totalTrailers = await Trailer.countDocuments(search != '' ? searchOptions : {});
    const totalPages = Math.ceil(totalTrailers / perPage);
    const startIndex = (page - 1) * perPage;
    const results = await Trailer.find(search != '' ? searchOptions : {}).skip(startIndex).limit(perPage);
    return res.json({ results, totalPages, currentPage: page, totalTrailers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "No se obtuvo la lista de acoplados" });
  }
};

const getTrailer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await Trailer.findById(id);
    if (!data) {
      return res.status(404).json({ message: "ID no encontrado" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "No se obtuvo el acoplado con ese id" });
  }
};

const createTrailer = async (req: Request, res: Response) => {
  try {
    const data = await Trailer.create(req.body);
    res.send({ data });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "La patente ya existe" });
      }
    }
    return res.status(500).json({ message: "No se creo el acoplado" });
  }
};

const updateTrailer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await Trailer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(200).json(data);
    }
    res.send({ data });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "La patente ya existe" });
      }
    }
    return res.status(500).json({ message: "No se edito el acoplado" });
  }
};

const deleteTrailer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await Trailer.deleteOne({ _id: id });
    res.send({ data });
  } catch (error) {
    return res.status(500).json({ message: "No se elimino el acoplado" });
  }
};

export { getTrailers, getTrailer, createTrailer, updateTrailer, deleteTrailer };