module.exports = function(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next()
    }
    return res.redirect('/')
}