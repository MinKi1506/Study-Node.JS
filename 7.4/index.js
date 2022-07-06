let express = require("express");
let app = express();

//mysql 접속 정보 지정
let mysql = require("mysql2");
let connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "minkidb"
})

//------------------------------------------------------------------------------------
//서버 기본셋팅

app.set("views", __dirname + "/views"); 
                                //__dirname: 현재폴더라는 뜻
                                //__dirname + "/view" : 현재폴더의 하위폴더인 'views'라는 폴더에 파일이 위치한다는 셋팅
                
app.set("view engine", "ejs"); //: 파일들을 ejs엔진을 사용하여 오픈한다는 셋팅
                               //ejs: html 태크 파일을 열어주는 엔진

app.use(express.json()); // json 형식의 데이터를 사용하겠다!
app.use(express.urlencoded({extended:false})); // post 형식 데이터를 받을 때 extended가 true라면 추가로 패키지를 설치해야 함
                                               // false형태일때는 따로 패키지 설치가 필요없기 떄문에 지금은 false를 사용 

//------------------------------------------------------------------------------------
//api 구성

app.get("/", function(req, res){
    res.render("index.ejs");    // index.ejs 파일의 위치는 현재폴더에서 하위폴
})

app.get("/second", function(req, res){
    // res.send("second page") send: 그냥 값을 문자형태로 보내 띄워주는 것! render와는 다르다  
    console.log("아이디는 "+req.query.id+"이고, 비밀번호는 "+req.query.password+"입니다");

    if(req.query.id == "test" && req.query.password == 1234){
        res.render("second.ejs");
    } else{
        // res.send("로그인에 실패하셨습니다.");
        res.redirect("/"); //: 설정된 주소로 초기화시켜 이동한다
    }
})

app.post("/login", function(req,res){
    let input_id = req.body.id;
    let input_password = req.body.password;
    //input 데이터를 sql로 담아서 쿼리문을 실행하고 결과값을 리턴
    connection.query(
        `select * from user_info where user_id= ? and user_password= ?`, [input_id,input_password],
        function(err, result){
            if(err){   //sql에러일 때
                console.log("에러입니다");
            } else {
                if(result.length > 0){ //아이디와 패스워드 데이터가 조회된다 = DB에 해당 정보가 있다 = 로그인 성공
                    console.log("로그인 성공")
                    res.render("second.ejs");
                } else { // 아이디와 패스워드가 조회되지 않는다 = DB에 해당 정보가 없다 = 로그인 실패
                    console.log("로그인 실패")
                    res.redirect("/");
                }
            }
        }
    );
})

app.get("/signup", function(req, res){
    res.render("signup.ejs")
})

app.post("/signup2", function(req, res){
    let input_id = req.body.id;
    let input_password = req.body.password;
    connection.query(
        `insert into user_info(user_id, user_password) values (?,?)`,[input_id,input_password],
        function(err, result){
            if(err){
                console.log("에러입니다.")
            }else{
                console.log('회원등록이 완료되었습니다')
                res.redirect("/");
            }
        }
    );
})

app.get("/update", function(req, res){
    res.render("update.ejs");
});

app.post("/update2", function(req,res){
    let input_id = req.body.id;
    let input_password = req.body.password;
    console.log(input_id+"와"+input_password)
    connection.query(
        `update user_info set user_password = ? where user_id = ?`,[input_password, input_id],
        function(err,result){
            if(err){
                console.log("에러: "+err);
            }else{
                console.log('성공적으로 수정되었습니다.')
                res.redirect("/");
            }
        }
    );
});

app.get("/delete",function(req, res){
    res.render("delete.ejs");
});

app.post("/delete2", function(req, res){
    let input_id = req.body.id;
    let input_password = req.body.password;
    connection.query(
        `delete from user_info where user_id = ? and user_password = ?`,[input_id, input_password],
        function(err, result){
            if(err){
                console.log("에러: "+err)
            }else{
                console.log("계정이 삭제 되었습니다.")
                res.redirect("/")
            }
        }
    )
})

app.post("/third", function(req, res){
    console.log(req.body);
    let input_name = req.body.user_name; // post형식은 body에 숨겨서 데이터를 전송한다 (보안성)
    let input_phone = req.body.user_phone; // get형식의 데이터 전송은 url에 데이터를 담아서 query로 보내는 형식이다
    console.log("유저이름은 "+input_name+"이고, 전화번호는 "+input_phone+"입니다");
    res.render("third.ejs",
        {
            name : input_name,
            phone : input_phone
        }
    );
})
//------------------------------------------------------------------------------------

let port = 3000;
//listen =서버가 port를 바라보게 한다. 그리고, 함수를 실행한다
app.listen(port, function(){
    console.log("서버를 시작합니다")

})