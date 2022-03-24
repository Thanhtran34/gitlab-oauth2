/**
 * The routes.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */

 import express from 'express'
 import { router as homeRouter } from './homeRouter.js'
 import { router as userRouter } from './userRouter.js'
 
 export const router = express.Router()
 
 router.use('/', homeRouter)
 router.use('/user', userRouter)
 
 router.use('*', (req, res, next) => {
   const error = new Error()
   error.status = 404
   error.message = 'Not Found'
   next(error)
 })
 