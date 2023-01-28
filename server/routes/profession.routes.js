const express = require('express')
const Profession = require('../models/Profession')
const router = express.Router({mergeParams: true})

router.get('/', async (req, res) => {
    try {

        // получаем список профессий из базы с пом find
        const professions = await Profession.find()
        res.status(200).send( professions)
    } catch (e) {
        // через метод .json отправляем сообщение на клиент
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})


module.exports = router