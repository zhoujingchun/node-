
const express=require('express');
const cookieParser=require('cookie-parser');
const bodeParser=require('body-parser');
const expressStatic=require('express-static');
const ejs=require('ejs');
const consolidate=require('consolidate');
const MongoControl=require('./databasecontrol').MongoControl;
const fs=require('fs');
const path=require('path');
const moment=require('moment');
var server=express();
server.listen(3000);
server.use(cookieParser());
server.use(bodeParser.urlencoded({
    extended:true
}));
var page=new MongoControl('blog','page');
var comment=new MongoControl('blog','comment');

//确定文件输出格式
server.set('view engine','html');
//确定文件路径
server.set('views','./views');
//确定模板引擎
server.engine('html',consolidate.ejs);
//后台功能接口的静态文件请求

//后台功能路由
server.use('/admin',require('./admin'));


   //首页接口
     server.get('/',function (req,res) {
         page.find({},function (err,data) {
             if(err){
                 console.log(err);
                 return
             }
             res.render('index.ejs',{data:data})
         })


   });
     // 文章接口
      server.get('/p',function (req,res) {
          var _id=req.query._id;
          page.findById(_id,function (err,result) {
              if(result.length==0){
                  res.status(403).send('Welcome My Secret 花园')
              }
              var data=result[0];
              //获得每个文章所对应的评论
            comment.find({fid:_id,state:1},function (err,result1) {
                if(err)
                {
                    console.log(err);
                    return
                }
                res.render('page.ejs',{data:data,comment:result1})
            })
              
          })
          
          
      });

      //评论接口
   server.post('/submitComment',function (req,res) {
       var _id=req.query._id;
       var {email,content}=req.body;

       //简单的表单验证 ： 不允许为空
       if(!_id){
           res.send('不允许评论');
           return
       }
       if(!email || !content){
           res.send('不允许评论');
           return
       }
       comment.insert({
           fid:_id,
           content:content,
           author:email,
           date:moment().format('YY3Y-MM-DD HH-mm-ss'),
           state:0
       },(err,reslut)=>{
           if(err){
               res.status(500).send('服务器崩了，兄dei');
               return
           }
           res.send('您的评论已被发送审核中。。。。')
           //res.redirect('/p?_id='+_id)
   })

   });

   server.use(expressStatic('./www'));
 //server.use('/admin',express.static('./static',{index:false}));

