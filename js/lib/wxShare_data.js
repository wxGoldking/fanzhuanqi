var wxdata = {
  wx_account : new Array(4),
  wx_share : new Array(4),
  wx_myuser : new Array("wx56449322e130500a","4ecc53570961bc8924743f10931cc040"),
   
  access_token : "", // 凭证
  token_expires_in : "" , // 凭证过期时间 单位：s
  jsapi_ticket : "", // 凭证
  ticket_expires_in : "" , // 凭证过期时间 单位：s
  url : "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + "wx56449322e130500a" + "&secret=" + "4ecc53570961bc8924743f10931cc040",
   
  // 获取access_token 
  // *注意* 经过实际开发测试，微信分享不支持跨域请求，因此获取access_token的请求必须从服务器发起，否则无法获取到access_token
  get_access_token: function (){
          $.ajax({
          type : "GET",
          url : wxdata.url,
          dataType : "jsonp", // 解决跨域问题，jsonp不支持同步操作
          cache : false,
      //  jsonp :'callback',
          success: function(msg) { 
          // 获取正常 {"access_token":"ACCESS_TOKEN","expires_in":7200}
          // 获取失败 {"errcode":40013,"errmsg":"invalid appid"}
              wxdata.access_token = msg.access_token; // 获取到的交互凭证 需要缓存，存活时间token_expires_in 默认为7200s
              wxdata.token_expires_in = msg.expires_in; // 过期时间 单位：s
              if (access_token != "" || access_token != null) {
                  console.log("get access_token success： " + wxdata.access_token);
              } else {
                  console.log("get access_token fail " +wxdata.access_token);
              }
          },
          error: function(msg){
              alert("get access_token error!! ： ");
          }
      });
  },
   
  // 获取jsapi_ticket
  // *注意* 经过实际开发测试，微信分享不支持跨域请求，因此获取jsapi_ticket的请求必须从服务器发起，否则无法获取到jsapi_ticket
  get_jsapi_ticket : function(){
      $.ajax({
          type : "GET",
          url : "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + wxdata.access_token +"&type=jsapi",
          dataType : "jsonp",
          cache : false,
          async : false,
          jsonp :'callback',
          success : function(msg) { 
          /* 
              {
                  "errcode":0,
                  "errmsg":"ok",
                  "ticket":"e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
                  "expires_in":7200
              } 
          */
              if(msg.errcode == 0){
                  wxdata.jsapi_ticket = msg.ticket; // 需要缓存，存活时间ticket_expires_in 默认为7200s
                  wxdata.ticket_expires_in = msg.expires_in; // 过期时间 单位：s
                  console.log("get jsapi_ticket success");
              } else {
                  console.log("get jsapi_ticket fail");
              }
          },
          error : function(msg){
              alert("get jsapi_ticket error!!! ");
          }
      });
  },
  // 数据签名 
  create_signature : function(nocestr,ticket,timestamp,url){
      var signature = "";
      console.log(nocestr,ticket,timestamp,url)
      // 这里参数的顺序要按照 key 值 ASCII 码升序排序
      var s = "jsapi_ticket=" + ticket + "&noncestr=" + nocestr + "&timestamp=" + timestamp + "&url=" + url;
      console.log('s............',s)
      return hex_sha1(s); 
  },

  // 自定义创建随机串 自定义个数0 < ? < 32 
  create_noncestr : function () {
     var str= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
     var val = "";
    for (var i = 0; i < 16; i++) {
       val += str.substr(Math.round((Math.random() * 10)), 1);
     }
  return val;
},
   
  // 自定义创建时间戳
  create_timestamp : function () {
  return new Date().getSeconds();
}
   
}

// wxdata.get_access_token(); // 1
wxdata.access_token = "14_ME4llpMF5qQjNOJUAkIFq0zDdyMqP-e5-_DZQGga1ZdIgvDX28nuFIHXrLOWXD72G7SLV8giARvPnOgyLkQGZUQV7F3gJjQ8-lC2MKap00VMSBUq5eu8mbWfOp5JQOZrB2T67ZFV2lXGWW1FECTcADATRI"; //2

// wxdata.get_jsapi_ticket(); //3
wxdata.jsapi_ticket = "HoagFKDcsGMVCIY2vOjf9tCSElb-l1NtX5k6K3O27JBoRK6r_tHHsFJhdCpDr5tJR5mQVF4CXblV12kxW8QXFQ" //4

// ----- 5 开始 ------
var timestamp = wxdata.create_timestamp();  // timestamp
var noncestr = wxdata.create_noncestr(); // noncestr
var url = window.location.href;

wxdata.wx_account[0] = wxdata.wx_myuser[0]; // appid
wxdata.wx_account[1] = timestamp;  // timestamp
wxdata.wx_account[2] = noncestr; // noncestr
wxdata.wx_account[3] = wxdata.create_signature(noncestr, wxdata.jsapi_ticket ,timestamp ,url);//signature
// console.log('wx_account[3]',wxdata.wx_account[3])

wxdata.wx_share[0] = "http://www.jianjiyudao.com/images/taiji.png"; // share_img 分享缩略图图片
wxdata.wx_share[1] = window.location.href;// share_link 分享页面的url地址，如果地址无效，则分享失败
wxdata.wx_share[2] = "最火爆的的益智游戏！！！快来体验吧！！！";// share_desc
wxdata.wx_share[3] = "翻转棋(黑白子.........)";// share_title
//  --------  5 结束 ----------