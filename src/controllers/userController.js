/**
 * User controller.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import axios from "axios";
import createError from "http-errors";
/**
 * Encapsulates a user controller.
 */
export class UserController {
  async getUserDetails(req, res, next) {
    try {
      const rootUrl = "https://gitlab.lnu.se/api/v4/user";
      if (req.session.token) {
        const response = await axios.get(rootUrl, {
          headers: { Authorization: `Bearer ${req.session.token}` },
        });
        req.session.user = response.data.id;
        res.render("profile", { userData: response.data });
      } else {
        createError(401, "Fail to get user's details!");
      }
    } catch (e) {
      next(e);
    }
  }

  // Get user activities in gitlab
  async getUserActivities(req, res, next) {
    try {
      const list = [];
      const firstUrl = `https://gitlab.lnu.se/api/v4/users/${req.session.user}/events?per_page=100&page=1`;
      const secondUrl = `https://gitlab.lnu.se/api/v4/users/${req.session.user}/events?per_page=1&page=101`
        if (req.session.user) {
          const firstResponse = await axios.get(firstUrl, {
            headers: { Authorization: `Bearer ${req.session.token}` },
          });
          const secondResponse = await axios.get(secondUrl, {
            headers: { Authorization: `Bearer ${req.session.token}` },
          });
          list.push(...firstResponse.data);
          list.push(...secondResponse.data);
        } else {
          createError(401, "Fail to get activities");
        }
      res.render("activities", { list: list});
    } catch (e) {
      next(e);
    }
  }

  // clean session and delete avatar image of user
  logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }
}
