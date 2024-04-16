exports.loginCheckMiddleWare = (req,res,next) => {
    const username = req.session.username
    if (username) {
      next();
    }else{
      res.redirect('/login');
    }
}