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
  getUserDetails(req, res) {
    console.log(req.session.token);
    if (req.session.token) {
      axios({
        url: "https://gitlab.lnu.se/api/v4/user",
        method: "GET",
        headers: { Authorization: "access_token" + " " + req.session.token },
      })
        .then((resp) => {
          res.cookie("login", resp.data.login, { httpOnly: true });
          res.send(resp.data);
        })
        .catch(function (err) {
          res.send(err);
        });
    } else {
      res.status(401).send();
    }
  }

  logout(req, res) {
    req.session = null;
    res.clearCookie("sess");
    res.clearCookie("login");

    res.status(200).send();
  }
}
