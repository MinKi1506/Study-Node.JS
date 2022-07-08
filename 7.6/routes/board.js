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
//선택한 게시물 로드
router.get("/info", function(req, res){
    let no = req.query._no;
    
    connection.query(
        `select * from board where No = ?`,[no],
        function(err, result){
            if(err){
                console.log("글 불러오기 에러: "+err);
            }else {
                res.render("info.ejs", {info : result}); //받아온 result를 다음 페이지로 건네줄 준비를 해야지!
            }
        }
    )
})

//해당 게시물 수정페이지로 이동
router.get("/update", function(req, res){
    let no = req.query._no;
    let title = req.query._title;
    let contents = req.query._contents;
    let writer = req.query._writer;

    res.render("update.ejs",{
        u_no : no, 
        u_title : title, 
        u_contents : contents, 
        u_writer : writer
        }
    )
})

//해당 게시물 수정
router.post("/update2", function(req, res){
    let no = req.body._no;
    let title = req.body._title;
    let writer = req.body._writer;
    let contents = req.body._contents;
    console.log(no, title, writer, contents+"를 수정할거죠?")

    connection.query(
        `update board set title = ? , writer = ? , contents = ? where No = ?`,[title, writer, contents, no],
        function(err, result){
            if(err){
                console.log('게시글 수정 에러: '+err);
            }else{
                console.log('성공적으로 게시글을 수정했습니다');
                res.redirect("/board/info?_no="+no);
            }
        }
    )
})


//해당 게시물 삭제
router.get("/delete", function(req, res){
    let no = req.query._no;
    console.log("삭제할 글의 No는 "+no+"입니다");

    connection.query(
        `delete from board where No = ?`,[no],
        function(err, result){
            if(err){
                console.log("글 삭제 에러: "+err);
            }else{
                console.log('글이 성공적으로 삭제 되었습니다.')
                res.redirect("/board");//이거의 기준은 index.js (첫 페이지)이다!
            }
        }
    )
})

module.exports = router;