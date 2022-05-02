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
      next(createError(404, "Not Found"));
    }
  }

  // Get user activities in gitlab
  async getUserActivities(req, res, next) {
    try {
      const list = [];
      const baseUrl = `https://gitlab.lnu.se/api/v4/users/${req.session.user}/events`;
      if (req.session.user) {
        const firstResponse = await axios.get(baseUrl, {
          headers: { Authorization: `Bearer ${req.session.token}` },
          params: {
            per_page: 100,
            page: 1,
          },
        });
        list.push(...firstResponse.data);
        // If user has 100 activities then run second request 
        if (list.length === 100) {
          const secondResponse = await axios.get(baseUrl, {
            headers: { Authorization: `Bearer ${req.session.token}` },
            params: {
              per_page: 1,
              page: 101,
            },
          });
          // check if user has more than 100 activities
          if (Object.keys(secondResponse.data).length > 0) {
            list.push(...secondResponse.data);
          }
        }
      } else {
        createError(401, "Fail to get activities");
      }
      res.render("activities", { list: list });
    } catch (e) {
      next(createError(404, "Not Found"));
    }
  }

  // clean session and delete avatar image of user
  logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }
}
