const express = require('express')
const Quality = require('../models/Quality')
const router = express.Router({mergeParams: true})

router.get('/', async (req, res) => {
    try {

        // получаем список профессий из базы с пом find
        const qualities = await Quality.find()
        res.status(200).send(qualities)
    } catch (e) {
        // через метод .json отправляем сообщение на клиент
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})


module.exports = router