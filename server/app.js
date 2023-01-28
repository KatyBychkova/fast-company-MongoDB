const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')
const {connect} = require('mongoose')
const initDatabase = require('./startUp/initDatabase')
const routes = require('./routes')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api', routes)  // все запросы кот сервер будет отдавать будут находиться по префиксу api

const PORT = config.get('port') ?? 8080

// if (process.env.NODE_ENV === 'production') {
//     console.log('Production')
// }else {
//     console.log('Development')
// }


async function start() {
    try {
        // при присоединении к БД once-один раз когда open - открыто соединение проверяем initDatabase
        mongoose.connection.once('open', ()=>{
            initDatabase()
        })
        await mongoose.connect(config.get('mongoUri'))
        app.listen(8080, () => {
            console.log(chalk.green(`Server has been started on port ${PORT}...`))
        })
    } catch (e) {
        console.log(chalk.red(e.message))
        process.exit(1) // 1- означ произошла ошибка
    }

}

start()


