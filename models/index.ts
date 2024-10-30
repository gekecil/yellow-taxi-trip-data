import { readdirSync } from 'fs'
import { basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Sequelize } from 'sequelize'
import pg from 'pg'

const sequelize = new Sequelize({
    username: process.env['DBUSERNAME'] || 'postgres',
    password: process.env['DBPASSWORD'] || '',
    database: process.env['DBDATABASE'] || 'yellow_taxi_trip_data',
    host: process.env['DBHOST'] || 'localhost',
    dialect: 'postgres',
    dialectModule: pg
})

const currentPath = fileURLToPath(import.meta.url)
const db: any = {}

readdirSync(dirname(currentPath))
.filter(
    (file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename(currentPath)
        )
    }
)
.forEach(
    async (file) => {
        const res = await import(`./${file}`)
        const model = res.model(sequelize)

        db[model.name] = model
    }
)

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

export default db
