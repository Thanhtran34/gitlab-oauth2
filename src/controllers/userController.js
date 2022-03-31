/**
 * User controller.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
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
        this.getUserAvatar(response.data.avatar_url);
        res.render("profile", { userData: response.data });
      } else {
        createError(401, "Fail to get user's details!");
      }
    } catch (e) {
      next(e);
    }
  }

  // send request to get avatar img and save to public folder
  async getUserAvatar(url) {
    const imageResponse = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const img = await sharp(imageResponse.data).toFormat("png").toBuffer();
    this.saveAvatarToPublic(img);
  }

  // save image to public folder
  saveAvatarToPublic(img) {
    const data = Buffer.from(img);
    fs.writeFile("public/avatar.png", data, (err) => {
      if (err) {
        throw new Error("Fail to write to file");
      }
    });
  }

  // Get user activities in gitlab
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
          createError(401, "Fail to get activities");
        }
      } while (list.length < 101);
      res.render("activities", { list: list.slice(0, 101) });
    } catch (e) {
      next(e);
    }
  }

  // clean session and delete avatar image of user
  logout(req, res) {
    req.session.destroy();
    fs.unlink("public/avatar.png", function (err) {
      if (err && err.code == "ENOENT") {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        throw new Error("Error occurred while trying to remove file");
      }
    });
    res.redirect("/");
  }
}
