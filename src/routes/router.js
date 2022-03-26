/**
 * The routes.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import express from "express";
import { HomeController } from "../controllers/homeController.js";
import { UserController } from "../controllers/userController.js";

export const router = express.Router();
const controller = new HomeController();
const userController = new UserController();

router.get("/AuthPage", (req, res) => controller.getAuthPage(req, res));
router.post("/getAccessToken", (req, res) =>
  controller.getAccessToken(req, res)
);
router.get("/getUserDetails", (req, res) =>
  userController.getUserDetails(req, res)
);
router.get("/logout", (req, res) => userController.logout(req, res));
router.use("*", (req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = "Not Found";
  next(error);
});
