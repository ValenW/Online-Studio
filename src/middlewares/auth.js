/**
 * auth middlerware for users have confirmed the email
 */
exports.isAuthenticated = function(req, res, next) {
  if (req.session.user) {
    if (req.session.user.confed == true) {
      next();
    } else {
      res.redirect('/wait');
    }
  } else {
    res.redirect('/login');
  }
}
/**
 * auth middlerware for users have not confirmed the email
 */
exports.isTempAuthenticated = function(req, res, next) {
  if (req.session.user) {
    if (req.session.user.confed == false) {
      next();
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
}