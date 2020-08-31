const Menu = require('../../models/menu')

module.exports = function(){
    return{
        async index(req, res){
            const pizzas = await Menu.find()
            return res.render('home', {pizzas:pizzas})
        }
    }
}