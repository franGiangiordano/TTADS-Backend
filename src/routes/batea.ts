import { Router } from 'express';
import {
  getBateas,
  createBatea,
  updatebateaById,
  deletebateaById,
  getBateaById,
} from '../controllers/batea';

const router = Router();

router.get('/', getBateas);

router.get('/:bateaId', getBateaById);

router.post('/', createBatea);

router.put('/:bateaId', updatebateaById);

router.delete('/:bateaId', deletebateaById);

export default router;