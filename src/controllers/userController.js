
import fetch from 'node-fetch'
import axios from 'axios'

let accessToken
 export class UserController {
  
   async login (req, res, next) {
     res.render('user/login')
   }
   
   async loginPost (req, res, next) {
      axios({
        // make a POST request
        method: 'POST',
        // to the Gitlab authentication API, with the client ID, client secret
        // and request token
        url: `https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.URI}&response_type=code&state=${process.env.STATE}&scope=${process.env.SCOPE}`,
        // Set the content type header, so that we get the response in JSOn
        headers: {
          accept: 'application/json',
        },
      }).then((res) => {
        // Once we get the response, extract the access token from
        // the response body
        const returnedCode = res.query.code
        this.getRequestToken(returnedCode)
        // redirect the user to the welcome page, along with the access token
        res.redirect('user/activities')
      })
}

async getRequestToken (requestToken) {
  axios({
    // make a POST request
    method: 'POST',
    // to the Gitlab authentication API, with the client ID, client secret
    // and request token
    url: `https://gitlab.example.com/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${requestToken}&grant_type=authorization_code&redirect_uri=${process.env.URI}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: 'application/json',
    },
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    accessToken = response.data.access_token
  })
}
 
   async logout (req, res, next) {
     try {
       delete req.session.user
       if (!req.session.user) {
         req.session.flash = { type: 'success', text: 'Logout successful.' }
         res.redirect('..')
       }
     } catch (error) {
       next(error)
     }
   }
 }
 