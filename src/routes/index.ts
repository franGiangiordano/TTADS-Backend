import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const pathRouter = __dirname; // current directory

// Remove .js from filename
const removeExtension = (fileName: string) => {
    return fileName.split('.').shift()!;
};

fs.readdirSync(pathRouter).filter((file) => {
    const fileWithOutExt = removeExtension(file);
    const fileExtension = path.extname(file);

    const skip = ['index'].includes(fileWithOutExt) || fileExtension !== '.js';

    if (!skip) {
        const routePath = path.join(__dirname, fileWithOutExt);
        router.use(`/${fileWithOutExt}`, require(routePath).default); // Load routes
        console.log('CARGAR RUTA ---->', fileWithOutExt);
    }
});

router.get('*', (req, res) => {
    res.status(404);
    res.send({ error: 'Not found' });
});

export default router;
