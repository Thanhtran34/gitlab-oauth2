/**
 * Home controller.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import crypto from "crypto";
import axios from "axios";
/**
 * Encapsulates a home controller.
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
      scope: ["read_user", "read_api"].join(" "),
    };
    const query = new URLSearchParams(options);
    const qs = `${query.toString()}`;
    res.render("app", { qs: qs });
  }

  //Get access token
  async getOauthTokens(req, res, next) {
    try {
      const requestToken = req.query.code;
      const url = `https://gitlab.lnu.se/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${requestToken}&grant_type=authorization_code&redirect_uri=${process.env.URI}`;

      const response = await axios.post(url);
      const expiration = response.data.expires_in + response.data.created_at;
      if (this.isTokenValid(expiration)) {
        req.session.refresh_token = response.data.refresh_token;
        req.session.save();
        res.render("keepLogin");
      } else {
        req.session.token = response.data.access_token;
        req.session.save();
        res.redirect("/profile");
      }
    } catch (e) {
      if(e) {
        res.render("denial");
      }
      next(e);
    }
  }

  //Check if the access token is expired or not
  isTokenValid(expiration) {
    const restTime = expiration - Math.ceil(Date.now() / 1000);
    return restTime < 0;
  }

  // Send request with refresh token to get new access token
  async getNewAccessToken(req, res, next) {
    try {
      const url = `https://gitlab.lnu.se/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${req.session.refresh_token}&grant_type=refresh_token&redirect_uri=${process.env.URI}`;
      const response = await axios.post(url);
      req.session.token = response.data.access_token;
      req.session.save();
      res.redirect("/profile");
    } catch (e) {
      if(e) {
        res.render("denial");
      }
      next(e);
    }
  }
}
