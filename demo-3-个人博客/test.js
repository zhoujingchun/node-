const MongoControl = require('./databasecontrol').MongoControl
const page = new MongoControl('blog','page')
const comment = new MongoControl('blog','comment')
const moment = require('moment')
   /* page.insert(
    {
       sort : 'JS',
       title : 'JS写起来真舒服',
         author : '罗得知',
        date : moment().format('YYYY-MM-DD HH-mm-ss'),
         content : 'JS是世界上最好的语言，什么python，简直是抄js的。。。',
         intro : "这是我写的第一篇文章，说js有多好"
    },
    ()=>{}
 )*/
comment.insert({
    fid : '5bfa21f0c103192390456be9',
    content : '要不是看你长得帅，写这些东西谁看?',
    author : 'skipper@handsome.com',
    date : moment().format('YYYY-MM-DD HH-mm-ss')
},()=>{})