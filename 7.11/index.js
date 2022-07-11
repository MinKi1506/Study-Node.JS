let express = require('express');
let app = express();
let seesion = require('express-session');

//post 통신방식 데이터를 받기위한 초기 설정
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//view 파일을 어느곳에서 가지고올지 설정
app.set('views', __dirname+'/views');

//view engine설정
app.set('view engine', 'ejs');

//mysql 설정
let mysql = require('mysql2')
let connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1234',
    database : 'minkidb'
})

//세션 설정
app.use(
    seesion({
        secret : "cckdkd2ffp3fkd3k",
        resave : false,
        saveUninitialized : true
    })
)

//api 정의

//세션존재여부 판단
app.get('/', function(req, res){
    if(req.session.login){
        console.log('기존 저장된 세션이 있습니다. 메인페이지로 이동합니다.');
        res.redirect('/contract');
    }else{
        console.log('기존 저장된 세션이 없습니다. 로그인페이지로 이동합니다.');
        res.redirect('/login');
    }
})

//contract에 접속 설정



//route 설정
let login = require('./routes/login.js');
app.use('/login', login);

let sign = require('./routes/sign.js');
app.use('/contract', sign);



let port = 3000;
app.listen(port, function(){
    console.log(port)
    console.log('서버를 시작합니다')
})