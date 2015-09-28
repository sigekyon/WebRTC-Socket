// WebSocketサーバに接続
var ws = new WebSocket('ws://186.32.2.36:1337');

// エラー処理
ws.onerror = function(e){
  $('#chat-area').empty()
    .addClass('alert alert-error')
    .append('<button type="button" class="close" data-dismiss="alert">×</button>',
      $('<i/>').addClass('icon-warning-sign'),
      'サーバに接続できませんでした。'
    );
}

// ユーザ名をランダムに生成
var userName = 'ゲスト' + Math.floor(Math.random() * 100);
// チャットボックスの前にユーザ名を表示
$('#user-name').append(userName);

// WebSocketサーバ接続イベント
ws.onopen = function() {
  $('#textbox').focus();
  // 入室情報を文字列に変換して送信
  ws.send(JSON.stringify({
    type: 'join',
    user: userName
  }));
};

// メッセージ受信イベントを処理
ws.onmessage = function(event) {
  // 受信したメッセージを復元
  var data = JSON.parse(event.data);
  var item = $('<li/>').append(
    $('<div/>').append(
      $('<i/>').addClass('icon-user'),
      $('<small/>').addClass('meta chat-time').append(data.time))
  );

  // pushされたメッセージを解釈し、要素を生成する
  if (data.type === 'join') {
    item.addClass('alert alert-info')
    .prepend('<button type="button" class="close" data-dismiss="alert">×</button>')
    .children('div').children('i').after(data.user + 'が入室しました');
  } else if (data.type === 'chat') {
    item.addClass('well well-small')
    .append($('<div/>').text(data.text))
    .children('div').children('i').after(data.user);
  } else if (data.type === 'defect') {
    item.addClass('alert')
    .prepend('<button type="button" class="close" data-dismiss="alert">×</button>')
    .children('div').children('i').after(data.user + 'が退室しました');
  } else if (data.type === 'image') {
    //WebSocket経由の画像を表示する
    item.addClass('well well-small')
    .prepend('<img  src='+ data.image +' alt=""></img>')
    .children('div').children('i').after(data.user);

  } else if (data.type === 'video') {
    //WebSocket経由の動画配信
    var rVideoData = data.video;
    var video2 = document.getElementById("vidoChat3");
    //video2.src = rVideoData;
    var ctxDraw = video2.getContext('2d');

    
    var img = new Image();
    img.src = rVideoData;
    img.width = 120;
    img.height = 120;
    ctxDraw.drawImage(img,0,0);


  } else if (data.type === 'draw') {
    //WebSocket経由でのリアルタイム描画
    var canvasDraw = document.getElementById("cvsdraw");
    var ctxDraw = canvasDraw.getContext('2d');
    var rDrawData = data.image;
    
    var img = new Image();
    img.src = rDrawData;
    img.width = 480;
    img.height = 320;
    //img.background-color = 'white';
    ctxDraw.drawImage(img,0,0);

  } else if(data.type === 'map') { 
    //WebSocket経由でのMAP情報取得
    var lat_ret = data.latitude;
    var long_ret = data.longitude;

    var gl_text_ret = "緯度：" + lat_ret + "<br>";
	gl_text_ret += "経度：" + long_ret + "<br>";
	document.getElementById("show_result2").innerHTML = gl_text_ret;

    // 取得して現在位置をGoogle Maps APIに渡す
    var mapCenter_ret = new google.maps.LatLng(lat_ret, long_ret);
    var mapDiv_ret = document.getElementById("mapClient");
    var options_ret = {
        zoom:16,            // 表示倍率を指定
        center:mapCenter_ret,    // 中央位置を指定
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        scaleControl:true    // 倍率変更を指定
    };
    // 地図を表示
    var map_ret = new google.maps.Map(mapDiv_ret, options_ret);
    // マーカーを表示
    var marker_ret = new google.maps.Marker({
        position:mapCenter_ret,
        map:map_ret,
        title:"相手"});
        map_ret.setCenter(mapCenter_ret);

  } else if(data.type === 'gallary') {
    //ギャラリー画像の共有
    var wsBigImg = document.getElementById('bigImg'); 
    wsBigImg.src = data.image;

    /*var wsimg = document.createElement('img');
    wsimg.src = data.image;
    wsimg.width = 100;
    wsimg.height = 100;
    disp.appendChild(wsimg);*/

  } else if(data.type === 'websocketcount') {
    //WebSocketの接続数をサーバから通知
    document.getElementById("webSocketCount").innerHTML = "今、接続している人："+data.count;
    item.addClass('well well-small')
    .append($('<div/>').text('サーバからのお知らせです'))
    .children('div').children('i').after(data.user);
  }
  else {
    item.addClass('alert alert-error')
    .children('div').children('i').removeClass('icon-user').addClass('icon-warning-sign')
      .after('不正なメッセージを受信しました');
  }

  $('#chat-history').prepend(item).hide().fadeIn(500);
};


// 発言イベント
textbox.onkeydown = function(event) {
  // エンターキーを押したとき
  if (event.keyCode === 13 ) {

    ws.send(JSON.stringify({
      type: 'chat',
      user: userName,
      text: textbox.value
    }));
    textbox.value = '';
  }
};

// ブラウザ終了イベント
window.onbeforeunload = function () {
  ws.send(JSON.stringify({
    type: 'defect',
    user: userName,
  }));
};
