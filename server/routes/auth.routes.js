const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const {generateUserData} = require("../utils/helpers")
const tokenService = require('../services/token.service')
const router = express.Router({mergeParams: true})

// 1. get data from req (email, password, sex, profession, quality[], name)
// 2. check if user already exists
// 3. hash password
// 4. create user
// 5. generate tokens
router.post('/signUp', [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 8 символов').isLength({min: 8}),
    async (req, res) => {
        try {
            // получаем данные с клиента
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: 'INVALID_DATA',
                        code: 400,
                        // errors: errors.array() // посмотреть какие ошибки
                    }
                })
            }
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
            await tokenService.save(newUser._id, tokens.refreshToken)


            // 201 - все ок и что-то было создано
            res.status(201).send({...tokens, userId: newUser._id})


        } catch (e) {
            // через метод .json отправляем сообщение на клиент
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    }])

// 1. validate
// 2. find user
// 3. compare hashed password
// 4. generate token
// 5. return data
router.post('/signInWithPassword', [
    check('email', 'Email некорректный').normalizeEmail().isEmail(),
    check('password', 'Пароль не может быть пустым').exists(),
    async (req, res) => {
        try {

            // проверяем наличие ошибок
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: 'INVALID_DATA',
                        code: 400,
                        // errors: errors.array() // посмотреть какие ошибки
                    }
                })
            }

            const {email, password} = req.body

            // ищем юзера в базе
            const existingUser = await User.findOne({email})
            if (!existingUser) {
                return res.status(400).json({
                    error: {
                        message: 'EMAIL_NOT_FOUND',
                        code: 400,
                        // errors: errors.array() // посмотреть какие ошибки
                    }
                })
            }
            // сравниваем захешированнй пароль
            const isPasswordEqual = await bcrypt.compare(password, existingUser.password)
            if (!isPasswordEqual) {
                return res.status(400).json({
                    error: {
                        message: 'INVALID_PASSWORD',
                        code: 400,
                        // errors: errors.array() // посмотреть какие ошибки
                    }
                })
            }

            // генерируем новые токены
            const tokens = tokenService.generate({_id: existingUser._id})
            await tokenService.save(existingUser._id, tokens.refreshToken)

            // 200 все ок
            res.status(200).send({...tokens, userId: existingUser._id})

        } catch (e) {
            // через метод .json отправляем сообщение на клиент
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    }])


function isTokenInvalid(data, dbToken) {
    return !data || !dbToken || data._id !== dbToken?.user?.toString()
}

router.post('/token', async (req, res) => {
    try {
        const {refresh_token: refreshToken} = req.body
        const data = tokenService.validateRefresh(refreshToken)
        // {
        //     "data": {
        //     "_id": "63d908695ea1548d304d5569",  // пользователя к кот прикреплен токен
        //         "iat": 1675167849
        // }
        // }
        const dbToken = await tokenService.findToken(refreshToken)

        // проверяем
        if (isTokenInvalid(data, dbToken)) {
            return res.status(401).json({message: 'Unauthorized'})   // 401 - нет авторизации
        }

        // генерируем новые токены
        const tokens = await tokenService.generate({_id: data._id})
        await tokenService.save(data._id, tokens.refreshToken)

        res.status(200).send({...tokens, userId: data._id})
    } catch (e) {
        // через метод .json отправляем сообщение на клиент
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

module.exports = router