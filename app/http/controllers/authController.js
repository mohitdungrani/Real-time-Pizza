const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')

module.exports = function(){
    return{
        login(req, res){
            res.render('auth/login')
        },
        postLogin(req, res, next){
            passport.authenticate('local', (err, user, info) => {
                if(err){
                    req.flash("error", info.message)
                    return next(err)
                }
                if(!user){
                    req.flash("error", info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err){
                        req.flash("error", info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req, res, next)
        },

        register(req, res){
            res.render('auth/register')
        },

        async postRegister(req, res){
            const {name, email, password} = req.body
            console.log(req.body)

            if(!name || !email || !password){
                req.flash('error', 'All fields are required')
                req.flash('name',name)
                req.flash('email',email)
                res.redirect('/register')
            }
            User.exists({email:email},(err, result) =>{
                if(result){
                    req.flash('error', 'Email already taken')
                    req.flash('name',name)
                    req.flash('email',email)
                    res.redirect('/register')
                }
            })

            // Hash Password
            const hashedPassword = await bcrypt.hash(password, 10)
            // Create User
            const user = new User({
                name,
                email,
                password: hashedPassword
            })
            user.save().then((user) => {
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                res.redirect('/register')
            })
        },
        logout(req, res){
            req.logout()
            return res.redirect('/login')
        }
    }
}