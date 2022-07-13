let express = require('express');
let router = express.Router();

//smartcontract와 연동(ganache)
let Web3 = require('web3'); // npm i web3 라이브러리 다운받아야한다!
let product_contract = require('../smartContracts/test');
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')); //127.0.0.1 = localhost 이다!! 
let smartContract = new web3.eth.Contract(product_contract.abi, product_contract.address);

//계약서 등록하는 페이지로 이동하는 api
router.get('/',function(req, res){
    res.render('addSmartContract.ejs');
})

//계약서 등록하는 api
router.post('/addSmartContract', function(req, res){
    let no = req.body._no;
    let content = req.body._content;
    console.log(no, content);

    //가나슈에 있는 지갑 주소 중 첫번 째 주소를 가지고 오는 부분
    web3.eth.getAccounts(function(err, ass){ //ass = 주소리스트
        if(err){
            console.log('에러: '+err);
        }else{
            console.log(ass);
            let address = ass[0]; // address[0]=네트워크 주소리스트들 중 1번째 값

            //smart contract에 있는 '함수'를 호출
            smartContract.methods
                .add_Contract(no, content, '220713')
                .send({
                    from : address,
                    gas : 200000
                })
                .then(function(receipt){
                    console.log(receipt);
                    res.send(receipt);
                })
        }
    })
})

router.get('/sign', function(req, res){
    let n = 0; // n = 서명의 유무
    let no = 'a1';   //no = 문서번호
    if(n == 0){
        web3.eth.getAccounts(function(err, ass){
            if(err){
                console.log('에러: '+err);
            }else{
                let address = ass[0];
                smartContract.methods
                    .a_sign(no)
                    .send({
                        from : address,
                        gas : 2000000
                    })
                    .then(function(receipt){
                        res.send(receipt);
                    })
            }
        })
    }else if(n == 1){

    }
})

//계약서 정보 불러오기
router.get('/info', function(req, res){
    let no = 'a1';
    smartContract.methods
        .view_contract(no)
        .call()
        .then(function(result){
            res.send(result);
        })
})



module.exports = router;