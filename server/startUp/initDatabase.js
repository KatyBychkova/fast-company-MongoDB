const Profession = require('../models/Profession')
const Quality = require('../models/Quality')

const professionMock = require('../mock/professions.json')
const qualitiesMock = require('../mock/qualities.json')

module.exports = async () => {
    const professions = await Profession.find()  // Проверяем какие профессии есть в базе данных. find вернет всегда массив, ели ничего нет - пустой массив
    if (professions.length !== professionMock.length) {
        await createInitialEntity(Profession, professionMock) // если колво профессий в бд и в mock-данных разное, сохраняем все знаяения в БД
    }
}

async function createInitialEntity(Model, data) {
    await  Model.collection.drop() // сначала очищам всю эту коллекцию в БД чтобы избежать дублирования записей
    return Promise.all(
        data.map(async item => {
            try {
                delete item._id
                const newItem = new Model(item)
                await newItem.save() // save() данные которые мы пишем здесь заносит в MongoDB
                return newItem
            } catch (e) {
                return  e
            }
        })
    )
}