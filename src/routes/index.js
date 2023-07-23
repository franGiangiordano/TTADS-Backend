const express = require('express')
const router = express.Router()
const fs = require('fs')

const pathRouter = `${__dirname}` //current directory

//Remove .js from filename 
const removeExtension = (fileName) => {
    return fileName.split('.').shift()
}

fs.readdirSync(pathRouter).filter((file) => {
    const fileWithOutExt = removeExtension(file)
    const skip = ['index'].includes(fileWithOutExt)

    if (!skip) {
        router.use(`/${fileWithOutExt}` , require(`./${fileWithOutExt}`)) //Load routes 
        console.log('CARGAR RUTA ---->', fileWithOutExt)
    }
})

router.get('*', (req, res) => {
    res.status(404)
    res.send({ error: 'Not found' })
})

module.exports = router