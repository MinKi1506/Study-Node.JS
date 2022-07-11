let express = require('express');
let router = express.Router();

//mysql 설정
let mysql = require('mysql2');
let connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1234',
    database : 'minkidb'
})


//여기는 기본 주소가 localhost:3000/contract이다! 

//api정의
router.get('/',function(req, res){
    if(req.session.login){   //='req.session.login의 값이 있다면'
        res.render('main.ejs');
    }else{
        console.log('로그인이 필요한 페이지입니다')
    }
})




module.exports = router