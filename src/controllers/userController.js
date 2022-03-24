
 /**
  * Encapsulates a snippetController.
  */
 export class UserController {
  
   /**
    * The user log in the page.
    *
    * @param {object} req - Express request object.
    * @param {object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    */
   async login (req, res, next) {
     res.render('user/login')
   }
 
   /**
    * Logs out the currently logged in user.
    *
    * @param {object} req - Express request object.
    * @param {object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    */
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
 