const jwt = require('jsonwebtoken')
const config = require('config')
const Token = require('../models/Token')

class TokenService {
    //return: accessToken, refreshToken, expiresIn
    generate(payload) {
        const accessToken = jwt.sign(payload, config.get('accessSecret'), {
            expiresIn: '1h' // сколько действует токен
        })
        const refreshToken = jwt.sign(payload, config.get('refreshSecret'))
        return {
            accessToken, refreshToken, expiresIn: 3600
        }
    }

    //сохряняет refreshToken для определенного пользователя
    async save(userId, refreshToken) {
        const data = await Token.findOne({user: userId})
        if (data) {
            data.refreshToken = refreshToken
            return data.save()
        }
        const token = await Token.create({user: userId, refreshToken})
        return token
    }
}

module.exports = new TokenService()


//interface Tokens {
// 	userId: string
// 	accessToken: string
// 	refreshToken: string
// 	exporesIn: number
// }