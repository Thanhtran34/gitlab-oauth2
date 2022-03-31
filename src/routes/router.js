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

router.get("/", (req, res, next) => controller.getMainPage(req, res, next));
router.get("/login", (req, res, next) => controller.getAuthPage(req, res, next));
router.get("/oauth/redirect", (req, res, next) => controller.getOauthTokens(req, res, next));
router.get("/relogin", (req, res, next) => controller.getNewAccessToken(req, res, next));
router.get("/profile", (req, res, next) => userController.getUserDetails(req, res, next));
router.get("/activities", (req, res, next) => userController.getUserActivities(req, res, next));
router.get("/logout", (req, res) => userController.logout(req, res));
router.use("*", (req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = "Not Found";
  next(error);
});
