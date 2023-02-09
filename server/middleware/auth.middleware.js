const tokenService = require('../services/token.service')

// req, res, добавляем тк далее будем работать на экспрессе, а для него это нужно
module.exports = (req, res, next) => {
    // метод проверяет доступность сервера
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        // забираем токен
        const token = req.headers.authorization.split(' ')[1] // [0]Bearer  [1]ffdfdgfdsfgfsdgfdgfdgfg

        if (!token) {
            res.status(401).json({message: 'Unauthorized'})   // 401 - нет авторизации
        }

        // валидируем токены в хэдэрах
        // data { _id: '63e53cfd541518d77f13f507', iat: 1675967766, exp: 1675971366 }
        //  _id - авторизованного пользователя
        const data = tokenService.validateAccess(token)

        //проверим, корректный ли токен. Если токен не корректный, то пользователь не будет авторизован
        if (!data) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        // добавляем в req св-во user, оно будет соответ data
        req.user = data

        // вызываем метод next чтобы остальные middleware выполнялись и из цепочка не прерывалась
        next()
    } catch (e) {
        res.status(401).json({message: 'Unauthorized'})   // 401 - нет авторизации
    }
}