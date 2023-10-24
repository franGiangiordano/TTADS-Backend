import { Router } from 'express';
import {
  getBateas,
  createBatea,
  updatebateaById,
  deletebateaById,
  getBateaById,
} from '../controllers/batea';
import validatorBatea from "../validators/batea";
import { verifyToken , isManager, isAdmin} from "../middlewares/authJwt.js";


const router = Router();

router.get('/', getBateas);

router.get('/:bateaId', getBateaById);

router.post('/', [verifyToken, isManager], validatorBatea, createBatea);

router.put('/:bateaId', [verifyToken, isManager], validatorBatea, updatebateaById);

router.delete('/:bateaId', [verifyToken, isAdmin], deletebateaById);

export default router;