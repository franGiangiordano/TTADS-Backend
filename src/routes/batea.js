const Router = require("express");

const {
    getBateas,
    createBatea,
    updatebateaById,
    deletebateaById,
    getBateaById,
  } = require ("../controllers/batea.js");

const router = Router();

router.get("/", getBateas);

router.get("/:bateaId", getBateaById);

router.post("/", createBatea);

router.put("/:bateaId", updatebateaById);

router.delete("/:bateaId", deletebateaById);

module.exports = router;




