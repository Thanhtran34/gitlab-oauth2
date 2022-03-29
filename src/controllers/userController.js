/**
 * User controller.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
/**
 * Encapsulates a controller.
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
        this.getUserAvatar(response.data.avatar_url)
        res.render("profile", { userData: response.data });
      } else {
        res.status(401).send();
      }
    } catch (e) {
      next(e);
    }
  }

  async getUserAvatar(url) {
    const imageResponse = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const img = await sharp(imageResponse.data).toFormat("png").toBuffer();
    this.saveAvatarToPublic(img);
  }

  saveAvatarToPublic(img) {
    const data = Buffer.from(img);
    fs.writeFile(`public/avatar.png`, data, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File created successfully!");
      }
    });
  }

  async getUserActivities(req, res, next) {
    try {
      const list = [];
      let pageIndex = 1;
      const rootUrl = `https://gitlab.lnu.se/api/v4/users/${req.session.user}/events?per_page=20&page=${pageIndex}`;
      do {
        if (req.session.user) {
          const response = await axios.get(rootUrl, {
            headers: { Authorization: `Bearer ${req.session.token}` },
          });
          list.push(...response.data);
          pageIndex++;
        } else {
          res.status(401).send();
        }
      } while (list.length < 101);
      res.render("activities", { list: list.slice(0, 101) });
    } catch (e) {
      next(e);
    }
  }

  logout(req, res) {
    req.session = null;
    res.clearCookie("sess");
    res.redirect("/");
  }
}
