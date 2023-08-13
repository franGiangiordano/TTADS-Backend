const Batea = require('../models/batea.js');

const createBatea = async (req, res) => {
  const { patent } = req.body;

  try {
    const newBatea = new Batea({
        patent
    });

    const bateaSaved = await newBatea.save();

    res.status(201).json(bateaSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getBateaById = async (req, res) => {
  const { bateaId } = req.params;
  
  try{
    const batea = await Batea.findById(bateaId);
    res.status(200).json(batea);
  }catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
  
};

const getBateas = async (req, res) => {
  
  try{
    const bateas = await Batea.find();
    return res.json(bateas);
  }catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }    
 
};

const updatebateaById = async (req, res) => {
    try{
        const updatedbatea = await Batea.findByIdAndUpdate(
        req.params.bateaId,
        req.body,
        {
         new: true,
        }
        );        
        res.status(200).json(updatedbatea);
    }catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }       
};

const deletebateaById = async (req, res) => {
  const { bateaId } = req.params;

  try{
    await Batea.findByIdAndDelete(bateaId);
    res.status(204).json();
  }catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }   
};

module.exports = {createBatea,getBateaById,getBateas,updatebateaById,deletebateaById}