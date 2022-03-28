/**
 * User controller.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import axios from "axios";
/**
 * Encapsulates a controller.
 */
export class UserController {
  async getUserDetails(req, res, next) {
    try {
      const rootUrl = "https://gitlab.lnu.se/api/v4/user";
      if (req.session.token) {
        const response = await axios.get(rootUrl, {headers: { Authorization: `Bearer ${req.session.token}`}});
        req.session.user = response.data.id
        res.render("profile", { userData: response.data })
      } else {
        res.status(401).send();
      }
    } catch (e) {
      next(e);
    }
  }

  async getUserActivities(req, res, next) {
    try {
      const list = []
      let pageIndex = 1 
      const rootUrl = `https://gitlab.lnu.se/api/v4/users/${req.session.user}/events?per_page=20&page=${pageIndex}`
      do {
        if (req.session.user) {
          const response = await axios.get(rootUrl, { headers: { Authorization: `Bearer ${req.session.token}` }})
          list.push(...response.data)
          pageIndex++
        } else {
          res.status(401).send();
        }
      } while (list.length < 101)
      res.render("activities", {list: list.slice(0, 101)})
    } catch (e) {
      next(e);
    }
  }

  logout(req, res) {
    req.session = null;
    res.clearCookie("sess");
    return res.render("index")
  }
}
