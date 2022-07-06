// express 라이브러리 로드후 클래스 생성
let express = require("express");
let app = express();

// -------------------------------------------------------------------------------------------------------------------

//mysql 접속 정보 등록
let mysql = require("mysql2");
let connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "minkidb"
})

// -------------------------------------------------------------------------------------------------------------------

// express server 기본 셋팅
app.set("views", __dirname + "/minkiViews");

app.set("view engine", "ejs"); //랜더링 할 페이지들을 ejs엔진을 이용하여 랜더링 작업을 하겠다.

// -------------------------------------------------------------------------------------------------------------------

// post통신 방식에서 데이터를 받아오기 위한 셋팅
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// 서버를 시작하기 위한 셋팅
let port = 3000;
app.listen(port, function(){
    console.log("서버를 시작합니당");
});

// -------------------------------------------------------------------------------------------------------------------

// API정의
app.get("/", function(req, res){
    res.render("login.ejs");
});

// app.post("/login", function(req, res){
//     let input_id = req.body._id;
//     let input_password = req.body._password;
//     console.log("ID: "+input_id + "Password: "+input_password);
//     connection.query(
//         `select * from user_info where user_id = ? and user_password = ?`, [input_id, input_password],
//         function(err, result){
//             if(err){
//                 console.log("로그인 에러: "+err)
//             }else{
//                 if(result.length > 0){
//                     console.log("로그인에 성공했습니다");
//                     res.redirect("/");
//                 }else{
//                     console.log("등록된 회원이 아닙니다")
//                     res.redirect("/");
//                 }
//             }
//         }
//     );
// });


// -------------------------------------------------------------------------------------------------------------------

//route 작업 (회원관리에 대한 api들은 user.js로 옮기는 작업)

let user =  require("./routes/user"); //import랑 같은 기능! ./routes/user(모듈)을 import한다!
app.use("/login", user) //localhost:3000/login 이라는 주소에 접속 시, user(.js)파일을 사용(use)한다.

let board = require("./routes/board"); // ./routes/board를 import한다
app.use('/board',board); // localhost:3000/board 이라는 주소에 접속 시, board(.js)파일을 사용(use)한다.