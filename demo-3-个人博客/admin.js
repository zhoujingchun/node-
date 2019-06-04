const  express=require('express');
const  bodyParser=require('body-parser');
const  moment = require('moment');
const  cookieParser=require('cookie-parser');
const  MongoControl=require('./databasecontrol').MongoControl;
const  path=require('path');

var router=express.Router();
const page = new MongoControl('blog', 'page');
const comment = new MongoControl('blog','comment');
var cookieControl=require('./cookie');
var admin = new cookieControl();
//adm
//登陆页面
router.get('/',function (req,res) {

   if(admin.checkToken(req.cookies.token)){
        res.sendFile(
            path.resolve('./www/admin.html')
        )
    } else {
        res.redirect('/admin/login')
    }


});
//  登陆页面
router.get('/login',function(req,res){

    res.sendFile(path.resolve('./www/login.html'))
});
// 登陆成功后的接口

router.post('/login',function(req,res){
    if(req.body.username=='admin'&&req.body.password=='admin'){
        res.cookie('token',admin.getToken());
        // res.send('登录成功')
        res.redirect('/admin')
    }else{
        res.status(403).send('登录失败')
    }


});


//发布文章页面
router.post('/uploadPage',function (req,res) {

    if(admin.checkToken(req.cookies.token)){

    } else {
        res.status(403).send('你没有权限')
        return
    }
    var {sort,title,author,content,intro}=req.body;
    var date=moment().format('YYY-MM-DD HH-mm-ss');
    page.insert({
        sort:sort,
        tic:title,
        author:author,
        date:date,
        content:content,
        intro:intro

    },()=>{
        res.send('发表成功')
    })
});


//获得评论
/*router.get('/getComment',function(req,res){
    if(admin.checkToken(req.cookies.token)){

    } else {
        res.status(404).send('你没有权限');
        return
    }
    comment.find({state : 0},function(error,data){
        if(data.length == 0){
            res.send([]);
            return
        }
        var count = 0;
        for(var i = 0; i < data.length ; i++){
            var nowData = data[i];
            var nowDataFid = nowData.fid;
            page.findById(nowDataFid,function(error,result){
                var page = result[0];
                 console.log(page.title);
                nowData.f_title = page.title;
                nowData.f_intro = page.intro;
                count ++;
                if(count == data.length){
                    res.send(data)
                }
            })
        }
    })
})*/
router.get('/getComment',function(req,res){
    if(admin.checkToken(req.cookies.token)){

    } else {
        res.status(404).send('你没有权限');
        return
    }
    comment.find({state : 0},function(error,data){
        if(data.length == 0){
            res.send([]);
            return
        }

       var count = 0;
        for(var i = 0; i < data.length ; i++){
            var nowData = data[i];
            var nowDataFid = nowData.fid;

            page.findById(nowDataFid,function(error,result){
                var page = result[0];
               // console.log(page);
               nowData.f_tic = page.tic;
                nowData.f_intro = page.intro;


                count ++;
                if(count == data.length){
                    res.send(data)
                }
            })
        }
    })
});

//通过评论
router.get('/passComment',function (req,res) {
    if(admin.checkToken(req.cookies.token)){

    } else {
        res.status(404).send('你没有权限');
        return
    }

    var _id=req.query._id;
    comment.updateById(_id,{state:1},function (err,result) {
        res.send('ok')
    })

});
//不通过评论的接口
router.get('/noPassComment',function (req,res) {
    if(admin.checkToken(req.cookies.token)){

    } else {
        res.status(404).send('你没有权限');
        return
    }

    var _id=req.query._id;
    comment.updateById(_id,{state:2},function (err,result) {
        res.send('拒绝完成')
    })

});




module.exports = router;