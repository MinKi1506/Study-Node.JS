const { Router } = require("express");
let express = require("express");
let router = express.Router();

//mysql 설정
let mysql = require("mysql2");
let connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "minkidb"
});

module.exports =  router;

router.post("/", function(req, res){
    let input_id = req.body._id;
    let input_password = req.body._password;
    console.log("ID: "+input_id + "Password: "+input_password);
    connection.query(
        `select * from user_info where user_id = ? and user_password = ?`, [input_id, input_password],
        function(err, result){
            if(err){
                console.log("로그인 에러: "+err)
            }else{
                if(result.length > 0){
                    console.log("로그인에 성공했습니다");
                    res.redirect("/board");
                }else{
                    console.log("등록된 회원이 아닙니다")
                    res.redirect("/");
                }
            }
        }
    );
});
