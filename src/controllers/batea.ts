import { Request, Response } from 'express';
import { Batea, validateBatea } from '../models/batea';

const createBatea = async (req:Request, res:Response) => {

  const result = validateBatea(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { patent } = result.data;

  try {
    const newBatea = new Batea({
        patent
    });

    const bateaSaved = await newBatea.save();

    return res.status(201).json(bateaSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getBateaById = async (req:Request, res:Response) => {
  const { bateaId } = req.params;
  
  try{
    const batea = await Batea.findById(bateaId);
    if(!batea){
      return res.status(404).json({ error: 'ID no encontrado' });
    }
      return res.status(200).json(batea);
  }catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
  
};
/*
Method without pagination

const getBateas = async (req, res) => {
  
  try{
    const bateas = await Batea.find();
    return res.json(bateas);
  }catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }    
 
};*/

const getBateas = async (req:Request, res:Response) => {
  const page = parseInt(req.query.page as string) || 1; 
  const perPage = 10; 

  try {
    const totalBateas = await Batea.countDocuments(); 

    const totalPages = Math.ceil(totalBateas / perPage);

    const startIndex = (page - 1) * perPage;

    const bateas = await Batea.find().skip(startIndex).limit(perPage);

    return res.json({
      bateas,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};


const updatebateaById = async (req:Request, res:Response) => {
  
    const result = validateBatea(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try{
        const updatedbatea = await Batea.findByIdAndUpdate(
        req.params.bateaId,
        result.data,
        {
         new: true,
        }
        ); 
        if(!updatedbatea){
          return res.status(404).json({ error: 'ID no encontrado' });
        }      
         return res.status(200).json(updatedbatea);
    
    }catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }       
};

const deletebateaById = async (req:Request, res:Response) => {
  const { bateaId } = req.params;

  try{
    const result = await Batea.findByIdAndDelete(bateaId);
    if (!result) {
      return res.status(404).json({ error: 'ID no encontrado' });
    }
     return res.status(204).json();
  }catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }   
};

export {createBatea,getBateaById,getBateas,updatebateaById,deletebateaById}