/**
 * The user routes.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */

 import express from 'express'
 import { UserController } from '../controllers/userController.js'
 
 export const router = express.Router()
 const controller = new UserController()
 
 // GET, POST /login user
 router.get('/login', controller.login)
 // GET, POST /logout user
 router.get('/logout', controller.logout)
 