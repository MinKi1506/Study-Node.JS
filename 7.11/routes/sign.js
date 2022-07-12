let express = require('express');
let router = express.Router();
let moment = require('moment');

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
        let id = req.session.login.ID;
        connection.query(
            `select No, a_id, b_id, a, b from contract where a_id = ? or b_id = ?`,[id,id],
            function(err, result){
                if(err){
                    console.log('내 계약서 불러오기 오류: '+err);
                }else{
                    console.log(result)
                    res.render('main.ejs',{
                        contracts : result
                    })
                }
            }
        )
    }else{
        console.log('로그인이 필요한 페이지입니다');
        res.redirect('/login');
    }
})

//계약서 작성 페이지로 이동
router.get('/addContract',function(req, res){
    if(req.session.login){
        res.render('addContract.ejs');
    }else{
        res.redirect('/login');
    }
})

//계약서 작성
router.post('/addContract2',function(req, res){
    let no = req.body._no;
    let content = req.body._content;
    let time = moment().format('YYYY/MM/DD hh:mm:ss');
    let b_id = req.body._b_id;
    let a_id = req.session.login.ID;

    console.log(no, content, b_id, time, a_id)

    connection.query(
        `insert into contract values (?,?,?,?,?,?,?)`,[no, content, time, 0, 0, a_id, b_id],
        function(err){
            if(err){
                console.log('계약서 작성 에러: '+err);
            }else{
                res.redirect('/contract');
            }
        }
    )
    }
)

//계약서 상세 페이지
router.get('/info', function(req, res){
    let no = req.query._no;
    if(req.session.login){
        connection.query(
            `select * from contract where No = ?`,[no],
            function(err, result){
               if(err){
                console.log('상세 계약서 불러오기 오류: '+err);
               }else{
                res.render('info.ejs',{
                    contract : result[0],
                    login_id : req.session.login.ID
                })
            }
    })        
    }else{
        console.log('로그인이 필요합니다')
        res.redirect('/login');
    }
})

router.get('/sign', function(req, res){
    if(req.session.login){
        let no = req.query._no;
        let n = req.query._n;
        console.log(no,n);

        if(n==0){  //n이 0이면 갑임
            connection.query(
                `update contract set a = 1 where No = ?`,[no],
                function(err, result){
                    if(err){
                        console.log('서명실패: '+err);
                    }else{
                        res.redirect('/contract');
                    }
                }
            )
        }else if(n==1){ //n이 1이면 을임
            connection.query(
                `update contract set b = 1 where No = ?`,[no],
                function(err, result){
                    if(err){
                        console.log('서명실패: '+err);
                    }else{
                        res.redirect('/contract');
                    }
                }
            )
        }
    }else{
        console.log('로그인이 필요한 기능입니다.')
        res.redirect('login');
    }
})



//1.계약서 내용 전체를 넣는 방법(textarea에 전체내용 기입, 파일 업로드)
//2.특정 항목들만 넣는 방법(다중 input)

module.exports = router