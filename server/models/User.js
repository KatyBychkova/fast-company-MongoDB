const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    completedMeetings: {type: Number},
    image: {
        type: String,
    },
    rate: Number, // тоже что и {type: Number}
    sex: {type: String, enum: ['male', 'female']},
    profession: {type: Schema.Types.ObjectId, ref: 'Profession'}, // уникальный Id в MongoDB. ref: '' -связь между этой записью и коллекцией Profession
    qualities: [{type: Schema.Types.ObjectId, ref: 'Quality'}], // качеств может быть много, поэтому все обернули в массив []
}, {timestamps: true})

module.exports = model('User', schema)