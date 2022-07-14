let express =require('express');
let router = express.Router();
let Crypto = require('crypto'); // SHA256 암호화를 위한 crypto 라이브러리!

//mysql 설정
let mysql = require('mysql2')
let connection = mysql.createConnection({
    host : process.env.host,
    port : process.env.port,
    user : process.env.user,
    password : process.env.password,
    database : process.env.database
})

//api 정의
// '/'로그인화면
router.get('/', function(req, res){
    if(req.session.login){ //로그인 되어있다면 바로 /contract(메인 페이지)로 이동
        res.redirect('/contract');
    }else{
        res.render('login.ejs')
    }
})

// '/signin' 로그인
router.post('/signin', function(req, res){
    let id = req.body._id;
    let password = req.body._password;
    let crypto = Crypto.createHmac('sha256', process.env.secretKey).update(password).digest('hex');

    console.log(id+'님, 로그인 되었습니다.');

    connection.query(
        `select * from user where ID = ? and password = ?`,[id, crypto], //입력된 비밀번호를 SHA256화하여 DB의 암호화된 비밀번호와 비교해서 로그인한다
        function(err, result){
            if(err){
                console.log('로그인 에러: '+err);
            }else{
                if(result.length > 0){
                    req.session.login = result[0];  //result는 list형태이고, result[0]은 json형태이다! request도 json형태이므로 저장가능
                    console.log('로그인 성공: '+id+'님이 로그인했습니다.');
                    res.redirect('/contract');
                }else{ // 로그인 실패
                    console.log('입력하신 내용으로 등록된 정보가 없습니다.')
                    res.redirect('/login');
                }
            }
        }
    )
})

//회원가입 페이지 렌더링
router.get('/signup', function(req, res){
    res.render("signup.ejs");
})

//입력한 회원정보로 DB에 회원 추가
router.post('/signup2',function(req, res){
    let id = req.body._id;
    let password = req.body._password; //SHA256을 이용하여 암호화 해보자
    
    let crypto = Crypto.createHmac('sha256', process.env.secretKey).update(password).digest('hex');
    console.log('암호화된 비밀번호: '+crypto);

    let name =req.body._name;
    let birth =req.body._birth;
    let phone =req.body._phone;

    connection.query(
        `select * from user where ID = ?`,[id],
        function(err, result){
            if(err){
                console.log('회원가입 에러: '+err);
            }else{
                if(result.length == 0){ //중복된 id가 아닌경우
                    connection.query(
                        `insert into user values (?,?,?,?,?)`,[id,crypto,name,birth,phone],
                        function(err2){
                            if(err2){
                                console.log('로그인 에러: '+err2);
                            }else{
                                res.redirect('/login');
                            }
                        }
                    )
                }else{ //중복된 아이디인 경우
                    res.send('이미 사용하고있는 아이디 입니다');
                }
            }
        }
    )
})

//로그아웃
router.get('/logout', function (req, res) {
    if (req.session.login) {
        req.session.destroy(  //세션을 파괴한다
            function (err) {
                if (err) {
                    console.log('로그아웃 에러: ' + err);
                } else {
                    res.redirect('/login');
                }
            }
        )
    } else {
        res.redirect('/login');
    }
})

module.exports = router;