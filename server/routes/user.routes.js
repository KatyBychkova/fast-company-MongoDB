const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = express.Router({mergeParams: true})


// :userId - параметр, который передается. у нас это id
router.patch('/:userId', auth, async (req, res) => {
    try {
        // получаем параметр userId
        const {userId} = req.params

        // проверяем что пользователь редактирует СВОЙ профиль (по id)
        // todo: userId ===current user id
        if (userId === req.user._id) {
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new: true}) // new: true означ что мы обновим юзера с совпадающим id, но  updatedUser мы получим тогда, когда все обновиться в базе. Иначе получим на фронтенд старые данные
            res.send(updatedUser)
        } else {
           res.status(401).json({message: 'Unauthorized'})   // 401 - нет авторизации
        }

    } catch (e) {
        // через метод .json отправляем сообщение на клиент
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        // забираем список пользователей
        console.log(req.user)
        const list = await User.find()
        res.send(list) // статус 200 идет по умолчанию, его можно не указывать res.status(200).send(list)
    } catch (e) {
        // через метод .json отправляем сообщение на клиент
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})


module.exports = router