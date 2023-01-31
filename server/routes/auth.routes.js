const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {generateUserData} = require("../utils/helpers")
const tokenService = require('../services/token.service')
const router = express.Router({mergeParams: true})

// 1. get data from req (email, password, sex, profession, quality[], name)
// 2. check if user already exists
// 3. hash password
// 4. create user
// 5. generate tokens


router.post('/signUp', async (req, res) => {
    try {
        // получаем email, password из req.body - там они хранятся
        const {email, password} = req.body
        const existingUser = await User.findOne({email: email})

        // если пользователь существует сообщаем на клиент об ошибке
        if (existingUser) {
            return res.status(404).json({
                error: {
                    message: 'EMAIL_EXISTS',
                    code: 400
                }
            })
        }

        // если пользователь новый хэшируем его пароль
        const hashedPassword = await bcrypt.hash(password, 12)

        // создаем нового пользователя
        const newUser = await User.create({
            ...generateUserData(), // генерирует аватарку, рейтинг, кол-во встреч. Если позже будем получать эту информацию с клиента  ...req.body ее перепишет
            ...req.body,
            password: hashedPassword
        })

        // генерируем новые токены
        const tokens = tokenService.generate({_id: newUser._id})
        await  tokenService.save(newUser._id, tokens.refreshToken)


        // 201 - все ок и что-то было создано
        res.status(201).send({...tokens, userId: newUser._id})


    } catch (e) {
        // через метод .json отправляем сообщение на клиент
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

router.post('/signInWithPassword', async (req, res) => {

})

router.post('/token', async (req, res) => {

})

module.exports = router