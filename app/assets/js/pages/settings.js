const config = require('electron-json-storage');

let json;

config.get('config', function(error, data) {
        json =data;

        createconfig();

        if (error) throw error;  

        init();

        bindSaveEvent();  
        
});

function createconfig(){
    if(!config.has('configs')){
        //create config in userdata
        json = {
            "configs": [
                {
                    "name":"东营市国税局",
                    "loginurl": "http://www.baidu.com:8999/",            
                    "username":"username",
                    "password": "boy",   
                    "plugins":[
                        {
                            "name":"plugin_0",
                            "on":true                    
                        },{
                            "name":"plugin_1",
                            "on":true
                        }
                    ]            
                }
            ],
            "notify": "true",
            "system":"true"            
        }

        config.set('config',json,null);
    }
}


function init(){
    //init data
    $('#cb_system').prop("checked",json.system?"checked":"");
    $('#cb_notify').prop("checked",json.notify?"checked":"");
    $('#loginurl').val(json.configs[0].loginurl);
    $('#username').val(json.configs[0].username);
    $('#password').val(json.configs[0].password);
    var arr = json.configs[0].plugins;
    for(var i=0;i<arr.length;i++){
        $('#plugins input').eq(i).prop("checked",json.configs[0].plugins[i].on?"checked":"");
    } 


    //stled
    $(".styled, .multiselect-container input").uniform({
        radioClass: 'choice'
    });

}
function bindSaveEvent(){

     //开机启动
    $('#cb_system').click(function(){      
        json.system=$('#cb_system').is(':checked'); 
        config.set('config', json, function(error) {
            if (error) throw error;
        });
    })

    //弹窗提醒
    $('#cb_notify').click(function(){      
        json.notify=$('#cb_notify').is(':checked'); 
        config.set('config', json, function(error) {
            if (error) throw error;
        });
    })

    //东营市国税局
    //登录url
    var obj = json.configs[0];
    $('#loginurl').blur(function(){      
        obj.loginurl=$('#loginurl').val(); 
        
        config.set('config', json, function(error) {
            if (error) throw error;
        });
    })

    //用户名
    $('#username').blur(function(){      
        obj.username=$('#username').val(); 
        
        config.set('config', json, function(error) {
            if (error) throw error;
        });
    })

    //密码
    $('#password').blur(function(){      
        obj.password=$('#password').val(); 
        
        config.set('config', json, function(error) {
            if (error) throw error;
        });
    })

     //插件
    $('#plugins input').click(function(){
        var id = this.id;
        var index = id.split('_')[1];
        //console.log(index+'_'+$(this).is(':checked'));
        obj.plugins[index].on=$(this).is(':checked');
        config.set('config', json, function(error) {
            if (error) throw error;
        });
    })
}