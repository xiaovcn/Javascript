
//获取当前窗口
curwin = require('electron').remote.getCurrentWindow();
var http = require('http');
var Iconv = require('iconv-lite');
var options = {
    host: 'www.petrostd.com',
    path: '/read/list.aspx?action=search&keyword=111&x=0&y=0',
    method: 'GET',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
    }
};
var req = http.request(options, function (res) {
    //console.log(`STATUS: ${res.statusCode}`);
    //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    //res.setEncoding('utf8');
    res.on('data', function (data) {
        //网页内容转码
        var html = Iconv.decode(data, 'gb2312');
        if (html) {
            //正则匹配
            var myRe = new RegExp("[\u4e00-\u9fa5]");
            var arr = myRe.test(html)
            //如果没有匹配到 则显示提醒
            if (arr==false) {
                showMessage('今日提醒', arr)
            }    
            
        }
        //console.log();
    });
});
req.end();


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


