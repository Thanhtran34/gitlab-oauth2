/**
 * Home controller.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
 import crypto from 'crypto'
 import axios from 'axios'
 /**
  * Encapsulates a controller.
  */
 export class HomeController {
   //Get main page
   getMainPage(req, res, next) {
     res.render("index");
   }
   //Get Gitlab homepage to login
   getAuthPage(req, res, next) {
     let state = crypto.randomBytes(16).toString("hex");
     const options = {
       client_id: process.env.CLIENT_ID,
       redirect_uri: process.env.URI,
       response_type: "code",
       state: state,
       scope: ["email", "read_user", "profile"].join(" "),
     };
     //res.cookie("XSRF-TOKEN", state);
     const query = new URLSearchParams(options);
     const qs = `${query.toString()}`;
     res.render("app", { qs: qs });
   }

   //Get access token
   async getOauthTokens(req, res, next) {
     try {
       const page = "https://gitlab.lnu.se/oauth/token";
       const requestToken = req.query.code;

       let options = {
         client_id: process.env.CLIENT_ID,
         client_secret: process.env.CLIENT_SECRET,
         code: requestToken,
         grant_type: "authorization_code",
         redirect_uri: process.env.URI,
       };
       const query = new URLSearchParams(options).toString();
       req.session.regenerate((err) => {
         if (err) {
           next(err);
         }
       });
       const response = await axios.post(page, query);
       req.session.token = response.data.access_token;
       res.redirect("/profile");
     } catch (e) {
       next(e);
     }
   }
 }