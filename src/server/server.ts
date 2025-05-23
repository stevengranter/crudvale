// * Imports * //

// External imports
import express, { Request, Response } from 'express' // Import Request, Repsonse types
import path from 'path'

// Internal imports
import ViteExpress from 'vite-express'
import errorHandler from './_middleware/errorHandler.js'
import cors from 'cors'
import corsConfig from './_config/cors.config.js'
import { apiRouter } from './1_routes/api/_.routes.js'
import { getDbPool, initializeDb } from './db.js'

import { SCRIPT_DIR } from './constants.js'
import appConfig from './_config/app.config.js'

async function startServer() {
    try {
        // 🛢️ Initialise db connection
        await initializeDb()

        // ☕️ Initialize express app
        const app = express()

        // 📎 Middleware
        app.use(cors(corsConfig))
        app.use(express.json({ limit: '10mb' }))
        app.use(express.urlencoded({ extended: true, limit: '10mb' }))
        app.use('/api', apiRouter)

        //  Server setup  //
        if (process.env.NODE_ENV !== 'production') {
            // Error Handler
            app.use(errorHandler)
            ViteExpress.listen(app, appConfig.PORT, () => {
                console.log(
                    `Server running on ${appConfig.PROTOCOL}://${appConfig.HOST}:${appConfig.PORT} ✅ `
                )
            })
        } else {
            const publicDir = path.join(SCRIPT_DIR, '../../dist/public')

            // Serve static files from the 'public' directory
            app.use(express.static(publicDir))

            // Handle all other 1_routes by serving 'index.html'
            app.get(['*splat'], (req: Request, res: Response) => {
                res.sendFile(path.join(publicDir, 'index.html'))
            })

            // Error Handler
            app.use(errorHandler)

            app.listen(appConfig.PORT, () => {
                console.log(
                    `Server running on ${appConfig.PROTOCOL}://${appConfig.HOST}:${appConfig.PORT} ✅ `
                ) //Log the actual port
            })
        }
        const shutdownHandler = () => {
            console.log('Shutting down server...')
            // Close database connections, etc.
            process.exit(0)
        }
        process.on('SIGTERM', shutdownHandler)
        process.on('SIGINT', shutdownHandler)
        return true
    } catch (error) {
        console.error('⛔️ Failed to start server:', error)
        process.exit(1)
    }
}

startServer().then(
    (result) => result && console.log('Server setup complete ✅ ')
)
