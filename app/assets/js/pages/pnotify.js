
//获取当前窗口
curwin = require('electron').remote.getCurrentWindow();
/*Event: ‘login’
Returns:

event Event

request Object:

method String
url URL
referrer URL

authInfo Object:

isProxy Boolean
scheme String
host String
port Integer
realm String
callback Function */




var cookies;
var http = require('http');
var Iconv = require('iconv-lite');
var options = {
    host: '76.12.120.17',
    path: '/webapp/login.do?state=login&userName=E8206050027&loginType=defaultAuthType&password=1',
    method: 'POST',
    headers: {
        'Accept': 'text/html, application/xhtml+xml, image/jxr, */*',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
        'Referer': 'http://76.12.120.17/webapp/login/loginAction.do?state=loginList&shell=true&templateId=1'
    }
};

var req = http.request(options, function (res) {

    //如果code为302 表示登陆
    console.log(`STATUS: ${res.statusCode}`);
    cookies = res.headers['set-cookie'];
    console.log(res.headers['set-cookie']);
    //console.log(`Cookies: ${res.headers.set-cookie}`);
    //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    //res.setEncoding('utf8');
    res.on('data', function (data) {
        //网页内容转码
        var html = Iconv.decode(data, 'utf8');
        if (html) {
            //正则匹配
            var myRe = new RegExp("[\u4e00-\u9fa5]");
            var arr = myRe.test(html)
            //如果没有匹配到 则显示提醒
            if (arr==false) {
                showMessage('今日提醒', arr)
            }    
            
        }
        //console.log(html);
    });
});

req.end();



//---strat 工作纪实插件
options = {
    host: '76.12.120.17',
    path: '/webapp/pskh/gzjs/GzjsAction.do?state=gzjsList&showTitle=false&displayMenuAndFooter=false',
    method: 'GET',
    headers: {
        'Accept': 'text/html, application/xhtml+xml, image/jxr, */*',
        'Accept-Language': 'zh-CN',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
        'Referer': 'http://76.12.120.17/webapp/login/loginAction.do?state=loginList&shell=true&templateId=1',
        'Cookie':cookies
    }
};

var req2 = http.request(options, function (res) {

    //如果code为302
    console.log(`STATUS: ${res.statusCode}`);
    
    //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    //res.setEncoding('utf8');
    res.on('data', function (data) {
        //网页内容转码
        var html = Iconv.decode(data, 'utf8');
        if (html) {
            //正则匹配 先匹配tr 
            var myRe = new RegExp("<tr>[\s\S]*?</tr>");
            var arr = myRe.exec(html)
            //遍历tr匹配td
            if (arr.length>0) {
                //showMessage('今日提醒', arr)
                for(var i=0;i<arr.length;i++){
                    //先匹配当周 绿色块#0EC29D
                    var isthisweek = new RegExp("0EC29D").test(arr[i]);
                    if(thisweek){
                        //如果是当周
                        var tdRe = new RegExp("title='[\S]+?'"); //title有数据说明有内容
                        var tdArr = tdRe.exec(arr[i]);
                        if(tdArr.length<2){
                            showMessage("工作纪实","您需要至少写2篇,当前数量"+tdArr.length);
                        }
                    }
                }
            }    
            
        }
        console.log(html);
    });
});

req2.end();

function showMessage(title, text) {
    var audio = document.createElement('audio')  //生成一个audio元素 
    audio.src = 'assets/audio/new_mail_notify.wav'
    audio.play();
    new PNotify({
        title: title,
        text: text,
        addclass: 'alert bg-primary alert-styled-left',
        stack: { "dir1": "down", "dir2": "right", "push": "top" },
        buttons: {
            sticker: false
        }, hide: false

    });

    $(document).on('click', '.ui-pnotify-closer', function () {
        //关闭弹出窗口
        curwin.close();
    });
}


