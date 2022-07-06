let express = require("express");
let router = express.Router();

let mysql = require("mysql2");
let connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "minkidb"
});

// -------------------------------------------------------------------------------------------------------------------

//API 정의
router.get("/add", function(req, res){
    res.render("write.ejs");
})

router.get("/", function(req, res){
    connection.query(
        `select * from board`,
        function(err, result){
            if(err){
                console.log("게시글 조회 에러: "+err);
            }else{
                console.log("모든 게시글을 조회합니다");
                res.render("main.ejs", {content : result});//메인 페이지에 content라는 키값을 가진 result value값들을 같이 보내주어 랜더링 하겠다.
            }
        }
    );
});

router.get("/writing", function(req, res){
    let input_title = req.query._title;
    let input_writer = req.query._writer;
    let input_contents = req.query._contents;
    console.log("제목: "+input_title+"작성자: "+input_writer+"내용: "+input_contents)

    connection.query(
        `insert into board(title, writer, contents) values (?,?,?)`,[input_title, input_writer, input_contents],
        function(err){
            if(err){
                console.log("에러: "+err);
            }else{
                console.log("게시글이 성공적으로 작성 되었습니다");
                res.redirect("/board");
            }
        }
    );
})

module.exports = router;