const {Schema, model} = require('mongoose')

const schema = new Schema({
    // храним id того, кто залогинился
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true}
}, {timestamps: true})

module.exports = model('Token', schema)