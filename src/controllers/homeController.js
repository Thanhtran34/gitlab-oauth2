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
   getAuthPage(req, res) {
    let state = crypto.randomBytes(16).toString('hex')
    const url = `https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.URI}&response_type=code&state=${state}&scope=${process.env.SCOPE}`
    res.cookie('XSRF-TOKEN',state);
    res.send({authUrl: url})
   }

   getAccessToken(req, res) {
    let state=req.headers["x-xsrf-token"]
    const uri = `https://gitlab.lnu.se/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.body.code}&grant_type=authorization_code&redirect_uri=${process.env.URI}$state=${state}`
    axios({
    url:uri,
    method:'POST',
    headers:{'Accept':'application/json'}
    })
    .then((resp) =>
    {
        if(resp.data.access_token)
        {
            req.session.token=resp.data.access_token;
        }
        res.send(resp.data);
   })
 }
}