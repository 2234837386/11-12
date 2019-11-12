const koa =require('koa')
let app = new koa()
//1 静态资源
const static =require('koa-static')
const path=require('path')
 //2处理post资源
const bodyparser=require('koa-bodyparser')

const router =require('koa-router')()
const query =require('./db/query')
//3路由

app.use(static(path.join(process.cwd(),'public')))
app.use(bodyparser())
app.use(router.routes())
app.use(router.allowedMethods());
//查
router.get('/api/list',async ctx=>{
    let data =await query('select *from userlist')
    ctx.body=data
})

//增
router.post('/api/add',async ctx=>{
    let {username,password,sex}=ctx.request.body;
    if(username &&password&&sex){
         let user =await query ('select *from userlist where username=?',[username]);
         
         if(user.data.length){
             ctx.body={
                 code:0,
                 msg:'此人已经存在'
             }
         }else{
            let data=await query('insert into userlist (username,password,sex) values(?,?,?)',[username,password,sex])
            if(data.msg==='error'){
                ctx.body={
                    code:0,
                    msg:error
                }
            }else{
                ctx.body={
                    code:1,
                    msg:'添加成功'
                }
            }
         }
    }else{
        ctx.body={
            code:2,
            msg:'参数缺失'
        }
    }
    
})

//删除
router.get('/api/del',async ctx=>{
    let {id}=ctx.query;
    if(id||id===0){
        try{
            await query('delete from userlist where id=?',[id])
            ctx.body={
                code:1,
                msg:'删除成功'
            }
        }catch(e){
            ctx.body={
                code:0,
                msg:e.error
            }
        }
    }else{
        ctx.body={
            code:2,
            msg:'参数失败'
        }
    }
})

//改
router.post('/api/gai',async ctx=>{
    let {username,password,sex,id}=ctx.request.body;

    if(id &&username &&password &&sex){
        try{
            await query ('update userlist set username=?,password=?,sex=?, where id=?',[username,password,sex,id])
            ctx.body={
                code:1,
                msg:'修改成功'
            }
        }catch(e){
            ctx.body={
                code:0,
                msg:e.error
            }
        }
    }else{
        ctx.body={
            code:2,
            msg:'参数失败'
        }
    }
})

app.listen(process.env.PORT ||3000,()=>{
     console.log('启动成功');
})