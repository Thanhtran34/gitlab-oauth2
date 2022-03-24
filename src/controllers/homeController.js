/**
 * Home controller.
 *
 * @author Thanh Tran
 * @version 1.0.0
 */
 import moment from 'moment'
 /**
  * Encapsulates a controller.
  */
 export class HomeController {
   /**
    * Renders a view and sends the rendered HTML string as an HTTP response.
    * index GET.
    *
    * @param {object} req - Express request object.
    * @param {object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    */
   index (req, res, next) {
     res.render('home/index')
   }
 
   /**
    * Renders a view, based on posted data, and sends
    * the rendered HTML string as an HTTP response.
    *
    * @param {object} req - Express request object.
    * @param {object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    */
   indexPost (req, res, next) {
     const locals = {
       name: req.body.name,
       dayName: moment().format('dddd')
     }
 
     res.render('home/index', { locals })
   }
 }
 