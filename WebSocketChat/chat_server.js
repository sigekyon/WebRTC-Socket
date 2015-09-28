// 1337番ポートでクライアントの接続を待ち受ける
var ws = require('websocket.io');
var server = ws.listen(1337, function () {
  console.log('\033[96m Server running at 186.32.2.36:1337 \033[39m');
});

//接続数
var connect = 0;

// クライアントからの接続イベントを処理
server.on('connection', function(socket) {
  // クライアントからのメッセージ受信イベントを処理
  socket.on('message', function(data) {
    // 実行時間を追加
    var data = JSON.parse(data);

    //chat,join,defectの場合
    if(data.type == 'chat' || data.type == 'join' || data.type == 'defect' || data.type == 'map') {

            //接続数計算
            if(data.type == 'join'){
              connect ++;
            } else if(data.type == 'defect' ){
              connect --;
            }

	    var d = new Date();
	    data.time = d.getFullYear()  + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	    data = JSON.stringify(data);
	    console.log('\033[96m' + data + '\033[39m');

            
    }

    if(data.type == 'image' ){
       console.log('\033[96m' + 'Image Send' + '\033[39m');
       data = JSON.stringify(data);
    }

    if(data.type == 'video' ){
       console.log('\033[96m' + 'video Send' + '\033[39m');
       data = JSON.stringify(data);
    }

    if(data.type == 'draw' ){
       console.log('\033[96m' + 'draw Send' + '\033[39m');
       data = JSON.stringify(data);
    }
    if(data.type == 'gallary' ){
       console.log('\033[96m' + 'gallary Send' + '\033[39m');
       data = JSON.stringify(data);
    }

    // 受信したメッセージを全てのクライアントに送信する
    server.clients.forEach(function(client) {
      if(client!=null) client.send(data);
    });
  });
});



//サーバーからのクライアントへの処理
var timerID = setInterval(function(){

  console.log('\033[96m' + connect + '\033[39m');
  var sendData = JSON.stringify({
    type: 'websocketcount',
    count: connect,
  });
  //全クライアントに通知
  server.clients.forEach(function(client) {
      if(client!=null) client.send(sendData);
  });

},10000);


