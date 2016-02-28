/*! CNAME v0.0.1 2016-02-28 05:31:41 */
!function(c){function a(d){if(b[d])return b[d].exports;var e=b[d]={exports:{},id:d,loaded:!1};return c[d].call(e.exports,e,e.exports,a),e.loaded=!0,e.exports}var b={};return a.m=c,a.c=b,a.p="",a(0)}([function(k,j,a){var d=(a(1),a(2),a(3),a(4),a(5),a(6),a(7)),i=a(8),e=(a(9),a(10),a(11),a(12),a(13)),b=a(8)(),h=a(14).Server(b),c=a(15),f=a(16),g=a(18);b.set("x-powered-by",!1),b.use(a(10)(c.morgan.format,c.morgan.options)),b.use(a(22).checkInstall),b.use(g.middleware()),b.use(d.json()),b.use(d.json({type:"application/*+json"})),b.use(d.json({type:"text/html"})),b.use(d.urlencoded({extended:!1})),b.use(a(24)),b.use(i["static"]("./public",{maxAge:864e10,setHeaders:function(a,b,c){a.set("Access-Control-Allow-Origin","*")}})),b.use(function(a,f,b,d){return a?(console.log(a),"string"==typeof a&&e.has(c.errorData,a)?b.json(c.errorData[a]):void b.sendStatus(500)):d()}),b.use(function(b,a){a.sendStatus(404)}),f.config.findOne({},function(a,b){return a?console.log(a):(b&&(c.isInstalled=!0,e.forEach(e.omit(b,["_id"]),function(a,b){c[b]=a})),void h.listen(c.port,function(){console.log("Listening on port "+c.port)}))})},function(a,b){a.exports=require("path")},function(a,b){a.exports=require("crypto")},function(a,b){a.exports=require("fs")},function(a,b){a.exports=require("tls")},function(a,b){a.exports=require("net")},function(a,b){a.exports=require("async")},function(a,b){a.exports=require("body-parser")},function(a,b){a.exports=require("express")},function(a,b){a.exports=require("url-parse")},function(a,b){a.exports=require("morgan")},function(a,b){a.exports=require("ent")},function(a,b){a.exports=require("pem")},function(a,b){a.exports=require("lodash")},function(a,b){a.exports=require("http")},function(a,b){a.exports={morgan:{format:":method :status :req[host] :url",options:{}},isChecked:!1,isInstalled:!1,errorData:{ERR_EXCEPTION:{error:"ERR_EXCEPTION","zh-CN":"未知错误"}},port:function(){return process.env.NODE_DEBUG?8080:80}(),hostnames:["es8.youkuohao.com"]}},function(c,e,d){var a=c.exports={},b=d(17);a.cname=new b({filename:"./data/cname.db",autoload:!0}),a.host=new b({filename:"./data/host.db",autoload:!0}),a.config=new b({filename:"./data/config.db",autoload:!0})},function(a,b){a.exports=require("nedb")},function(e,l,a){var h=a(19),c=a(13),f=a(20),b=a(15),d=a(16),i=a(9),j=a(11),g=a(1),k=(a(21),e.exports={});k.middleware=function(){return function(e,a,k){return b.isInstalled?e.headers.host==b.hostname?k():void d.host.findOne({hostname:e.headers.host},function(l,m){return l?(console.log("查询是否存在host失败"),console.log(l),a.sendStatus(500)):m?void d.cname.find({hostId:m._id},function(l,m){if(l)return console.log("查找cname失败"),console.log(l),a.sendStatus(500);if(0==m.length)return console.log("CNAME LOG LOST"),a.sendStatus(404);var k=i(e.headers.host+e.url,!0);""==k.pathname&&(k.pathname="/");var d={};if(c.map(m,function(a,f){var e=new RegExp(c.trim(a.pathname,"/").replace("\\\\","\\")),b=k.pathname.match(e);return b&&b[0]==k.pathname?(d=a,!1):void 0}),"file"==d.type){var n=g.join(d.content,k.pathname);return a.sendFile(n,{headers:{"Access-Control-Allow-Origin":"*",Expires:new Date(Date.now()+31536e6)}},function(b){b&&!a.headersSent&&a.sendStatus(404)}),!1}if("proxy"==d.type){var o={},p=d.content;return h.createProxyServer(o).web(e,a,{target:p},function(b){return b?(console.log(b),a.sendStatus(502)):void a.end()}),!1}if("block"==d.type)return a.redirect("http://www.google.com");if("redirect"==d.type)return a.redirect(d.content);if("json"==d.type)return a.json(JSON.parse(d.content));if("html"==d.type)return a.end(j.decode(d.content));if("api"==d.type){var q={method:"POST",url:d.content,qs:e.query,form:c.extend(e.body,e.query,{appId:b.appId,appSecret:b.appSecret,proxyAppId:d.appId})};return f(q,function(b,d,c){if(b)return console.log("请求外部接口失败"),console.log(b),a.sendStatus(500);try{a.json(JSON.parse(c))}catch(e){console.log(c),a.sendStatus(502)}}),!1}return a.sendStatus(404)}):k()}):k()}}},function(a,b){a.exports=require("http-proxy")},function(a,b){a.exports=require("request")},function(a,b){a.exports=require("node-static")},function(g,j,e){var c=e(13),f=e(11),h=e(6),a=e(15),d=e(16),i=e(23),b=g.exports={};b.requireInstall=function(d,b,c){return a.isInstalled?void c():b.json({error:"UNINSTALLED"})},b.requireEqualHost=function(d,e,b){return a.isInstalled?/^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|$)){4}$/.test(d.hostname)?b():c.indexOf(a.hostnames,d.hostname)<0?e.sendStatus(404):void b():b()},b.requireAdmin=function(b,c,e){var d=b.query.cname_token||b.body.cname_token;return d?a.cname_token!=d?c.json({error:"PERMISSION_DENIED"}):void e():c.json({error:"PERMISSION_DENIED"})},b.status=function(d,e,f){var b=c.omit(a,["password","_id"]);b.logged=!1,d.body.cname_token==a.cname_token&&(b=c.extend(b,{logged:!0})),e.json(b)},b.checkInstall=function(f,e,b){return a.isChecked?b():void d.config.findOne({},function(d,f){return a.isChecked=!0,d?(console.log("检查是否安装失败"),console.log(d),e.sendStatus(500)):(f&&(a.isInstalled=!0,a=c.extend(a,f)),void b())})},b.install=function(f,b,g){if(a.isInstalled)return b.sendStatus(403);var e=c.omit(f.body,["cname_token","debug"]);e.cname_token=i("cname"+Date.now()),d.config.insert(e,function(d,e){return d?(console.log("安装失败"),console.log(d),b.sendStatus(500)):(a=c.extend(a,e),a.cname_token=e.cname_token,a.isInstalled=!0,void b.json({}))})},b.login=function(d,b,f){if(!c.has(d.body,"password"))return b.json({error:"PERMISSION_DENIED"});if(d.body.password!=a.password)return b.json({error:"PERMISSION_DENIED"});var e=c.omit(a,"password");b.json(e)},b.renderApp=function(c,a,d){function b(a){return process.cwd()+"/public/assets/"+a+"/index.html"}a.sendFile(b("home"))},b.cnameCreate=function(a,b){return c.has(a.body,"hostId","type","content")?void d.host.findOne({_id:a.body.hostId},function(c,e){return c?b.json({error:"EXCEPTION_ERROR"}):e?(a.body.type=a.body.type||"html","html"==a.body.type&&(a.body.content=f.encode(a.body.content)),void d.cname.insert(a.body,function(a,c){return a?b.send({error:"EXCEPTION_ERROR"}):void b.json(c)})):b.json({error:"NOT_FOUND"})}):b.json({error:"LOST_PARAM"})},b.detail=function(a,b,e){return c.has(a.body,"hostId","cnameId")?void h.parallel([function(b){d.host.findOne({_id:a.body.hostId},b)},function(b){d.cname.findOne({_id:a.body.cnameId},b)}],function(c,a){return c?b.json({error:"EXCEPTION_ERROR"}):b.json({host:a[0],cname:a[1]})}):b.json({error:"LOST_PARAM"})},b.cnameUpdate=function(a,b){var e=d.cname;return c.has(a.body,"hostId","type","content","pathname")?("html"==a.body.type&&(a.body.content=f.encode(a.body.content)),a.body.pathname=a.body.pathname.toString(),void e.update({hostId:a.body.hostId},a.body,function(d,a){return d?b.send({error:"EXCEPTION_ERROR"}):a?void b.json(c.omit(a,["_id","__v"])):b.json({error:"NOT_FOUND"})})):b.json({error:"PARAMS_LOST"})},b.cnameListRead=function(b,a,d){var c=(model("App"),model("User"),model("Cname"));c.find({userId:b.user.userId},function(b,c){return b?a.send({error:"EXCEPTION_ERROR"}):void a.json({list:c})})},b["delete"]=function(b,a,c){d.cname.remove({_id:b.body.cnameId},{},function(b){return b?a.json({error:"EXCEPTION_ERROR"}):void a.json({})})}},function(a,d,b){var c=b(2);a.exports=function(a){return c.createHash("md5").update(a).digest("hex")}},function(f,g,d){var b=f.exports=d(8).Router(),a=d(22),c=d(25),e=d(26);b.route(/^(?!\/api\/)[a-zA-Z0-9\_\-\/]*$/).get(a.requireEqualHost,a.renderApp),b.route("/api/status").all(a.requireEqualHost,a.status),b.route("/api/install").post(a.install),b.route("/api/login").post(a.requireInstall,a.requireEqualHost,a.login),b.route("/api/host/list").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,c.list),b.route("/api/host/detail").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,c.detail),b.route("/api/host/new").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,c["new"]),b.route("/api/host/edit").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,c.edit),b.route("/api/host/delete").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,c["delete"]),b.route("/api/cname/list").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,a.cnameListRead),b.route("/api/cname/detail").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,a.detail),b.route("/api/cname/new").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,a.cnameCreate),b.route("/api/cname/edit").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,a.cnameUpdate),b.route("/api/cname/delete").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,a["delete"]),b.route("/api/tool/encode/html").post(a.requireInstall,a.requireEqualHost,a.requireAdmin),b.route("/api/tool/string2number").post(a.requireInstall,a.requireEqualHost,a.requireAdmin),b.route("/api/upload").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,e.upload),b.route("/api/file/readdir").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,e.readdir),b.route("/api/file/delete").post(a.requireInstall,a.requireEqualHost,a.requireAdmin,e.deleteFile),b.route("/api/file/download").get(a.requireInstall,a.requireEqualHost,a.requireAdmin,e.downloadFile)},function(e,g,c){var b=e.exports={},a=(c(15),c(16)),d=c(13),f=c(6);b["new"]=function(c,b,e){return d.has(c.body,"hostname")?""==d.trim(c.body.hostname)?b.json({error:"ILLEGAL_PARAM"}):void a.host.findOne({hostname:c.body.hostname},function(d,e){return d?b.json({error:"EXCEPTION_ERROR"}):e?b.json({error:"PERMISSION_DENIED",message:"域名已存在"}):void a.host.insert({hostname:c.body.hostname},function(a,c){return a?b.json({error:"EXCEPTION_ERROR"}):void b.json(c)})}):b.json({error:"LOST_PARAM"})},b.detail=function(c,b,f){if(!d.has(c.body,"hostId"))return b.json({error:"LOST_PARAM"});var e={};a.host.findOne({_id:c.body.hostId},function(f,d){return f?b.json({error:"EXCEPTION_ERROR"}):d?(e.host=d,void a.cname.find({hostId:c.body.hostId},function(a,c){return a?b.json({error:"EXCEPTION_ERROR"}):(e.list=c,void b.json(e))})):b.json({error:"NOT_FOUND"})})},b["delete"]=function(b,c,e){return d.has(b.body,"hostId")?void f.parallel([function(c){return a.host.remove({_id:b.body.hostId},{},c)},function(c){return a.cname.remove({hostId:b.body.hostId},{multi:!0},c)}],function(a,b){return a?c.json({error:"EXCEPTION_ERROR"}):c.json({result:b})}):c.json({error:"PERMISSION_DENIED"})},b.list=function(c,b,d){a.host.find({},function(a,c){return a?b.json({error:"EXCEPTION_ERROR"}):void b.json({list:c})})},b.edit=function(b,a,c){a.json({error:"API_BUILDING"})}},function(f,i,a){var b=a(27),c=a(13),g=a(28),d=a(1),h=a(29),e=(a(6),a(30),f.exports={});e.upload=function(a,i,e){if(!c.has(a.query,"uploadDir"))throw"PARAMS_LOST";var f=new h.IncomingForm;f.encoding="utf-8",f.parse(a,function(k,o,l){function m(){b.rename(n,j,function(a){return a?console.log(a):void i.json({})})}if(k)return e(k);var h=(process.cwd()+"/public",a.query.uploadDir);g.sync(h);var n=l.file.path,f=l.file.name,j=d.join(h,f);b.lstat(j,function(a,g){return a?m():void b.readdir(h,function(a,i){if(a)return e(a);for(var b=0,g=d.extname(f||""),k=d.basename(f,g);c.indexOf(i,f)>=0;)b+=1,f=k+"("+b+")"+g;j=d.join(h,f),m()})})})},e.readdir=function(d,e,f){if(!c.has(d.body,"path"))throw"PARAMS_LOST";var g=decodeURI(d.body.path),a={path:g},h=g;b.lstat(h,function(d,c){return d?f(d):(a.isFile=c.isFile(),a.stats=c,void(c.isDirectory()?b.readdir(h,function(b,c){return b?f(b):(a.files=c,void e.json(a))}):e.json(a)))})},e.deleteFile=function(a,g,h){if(!c.has(a.body,"path"))throw"PARAMS_LOST";var d=decodeURI(a.body.path),e={path:d},f=d;b.lstat(f,function(a,c){if(a)throw"FILE_NOT_EXIST";b.remove(f,function(a){return a?h(a):(e.deleteFail=!1,void g.json(e))})})},e.downloadFile=function(a,b,f){if(!c.has(a.query,"path"))throw"PARAMS_LOST";var d=decodeURI(a.query.path),e=d;b.download(e)}},function(a,b){a.exports=require("fs-extra")},function(a,b){a.exports=require("mkdirp")},function(a,b){a.exports=require("formidable")},function(a,b){a.exports=require("util")}]);