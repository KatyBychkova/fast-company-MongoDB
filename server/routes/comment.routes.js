const express = require('express')
const auth = require('../middleware/auth.middleware')
const Comment = require('../models/Comment')
const router = express.Router({mergeParams: true})

// /api/comment
router
    .route('/')
    .get(auth, async (req, res) => {
        try {
            // получаем информ с фронтенда из query параметров (они в адресной строке после ?)
            const {orderBy, equalTo} = req.query
            const list = await Comment.find({[orderBy]: equalTo})
            res.send(list)
        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    })
    .post(auth, async (req, res) => {
        try {
            const newComment = await Comment.create({
                ...req.body,
                userId: req.user._id
            })
            res.status(201).send(newComment)
        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    })


router.delete('/:commentId', auth, async (req, res) => {
    try {
        const {commentId} = req.params
        const removedComment = await Comment.findById(commentId)
        // const removedComment = await Comment.find({_id: commentId}) то же, только здесь фильтр по id прописали

        // проверяем, что коммент удаляет польз кот его оставлял
        if (removedComment.userId.toString() === req.user._id) {
            await removedComment.remove()
            return res.send(null)
        }else{
            res.status(401).json({message: 'Unauthorized'})   // 401 - нет авторизации
        }
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

module.exports = router