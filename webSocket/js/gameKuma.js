enchant();

window.onload = function() {

    var game_ = new Game(320, 320); // 表示領域の大きさを設定
    game_.fps = 24;                 // ゲームの進行スピードを設定
    game_.preload('./images/start.png', './images/gameover.png','./images/retry_button.png', './images/chara1.png', './images/bg1.png', './images/bg2.png', './images/hurdle.png', './images/igaguri.png', './images/bird.png'); // ゲームに使う素材を予め読み込み

    game_.onload = function() { // ゲームの準備が整ったらメインの処理を実行します

        /**
        * タイトルシーン
        *
        * タイトルシーンを作り、返す関数です。
        */
        var createStartScene = function() {

            var scene = new Scene();                   // 新しいシーンを作る
            scene.backgroundColor = '#fcc800';         // シーンの背景色を設定

            // スタート画像設定
            var startImage = new Sprite(236, 48);      // スプライトを作る
            startImage.image = game_.assets['./images/start.png']; // 画像を設定
            startImage.x = 42;                         // 横位置調整
            startImage.y = 157;                        // 縦位置調整
            scene.addChild(startImage);                // シーンに追加

            // タイトルラベル設定
            var title = new Label('くま競争');   // ラベルを作る
            title.width = 320;
            title.textAlign = 'center';                // 文字を中央寄せ
            title.color = '#ffffff';                   // 文字を白色に
            title.x = 0;                               // 横位置調整
            title.y = 96;                              // 縦位置調整
            title.font = '44px sans-serif';            // 44pxのゴシック体にする
            scene.addChild(title);                     // シーンに追加

            // 説明ラベル設定
            var info = new Label('STARTを押して開始 / タッチでジャンプ'); // ラベルを作る
            info.width = 320;
            info.textAlign = 'center';                 // 文字を中央寄せ
            info.color = '#ffffff';                    // 文字を白色に
            info.x = 0;                                // 横位置調整
            info.y = 222;                              // 縦位置調整
            info.font = '14px sans-serif';             // 14pxのゴシック体にする
            scene.addChild(info);                      // シーンに追加

            // スタート画像にタッチイベントを設定
            startImage.addEventListener(Event.TOUCH_START, function(e) {
                // 現在表示しているシーンをゲームシーンに置き換える
                game_.replaceScene(createGameScene());
            });

            // タイトルシーンを返します。
            return scene;

        };

        /**
        * ゲームシーン
        *
        * ゲームシーンを作り、返す関数です。
        */
        var createGameScene = function() {

            var scroll = 0; // スクロール量を記録する変数

            // 固定の値であることをわかりやすくするために大文字で書いています
            // 固定の値は「定数」と呼ばれ、言語によっては別の書き方をする場合があります
            // JavaScriptにもconstという書き方がありますが、対応していないブラウザがあるため使っていません
            var GROUND_LINE = 250;   // 地平線の高さ(固定)
            var SCROLL_SPEED = 10;   // スクロールの速さ(固定)

            var scene = new Scene();                   // 新しいシーンをつくる
            scene.backgroundColor = '#8cc820';         // シーンの背景色を設定

            // スクロールする背景1の設定
            var bg1 = new Sprite(320, 320);            // スプライトをつくる
            bg1.image = game_.assets['./images/bg1.png']; // 画像を設定
            bg1.x = 0;                                 // 横位置調整
            bg1.y = 0;                                 // 縦位置調整
            scene.addChild(bg1);                       // シーンに追加

            // スクロールする背景2の設定
            var bg2 = new Sprite(320, 320);            // スプライトをつくる
            bg2.image = game_.assets['./images/bg2.png']; // 画像を設定
            bg2.x = 320;                               // 横位置調整 320px右に配置(bg1の右隣に隙間なく並べる)
            bg2.y = 0;                                 // 縦位置調整
            scene.addChild(bg2);                       // シーンに追加

            // スコア表示用ラベルの設定
            var scoreLabel = new Label("");            // ラベルをつくる
            scoreLabel.color = '#fff';                 // 白色に設定
            scene.addChild(scoreLabel);                // シーンに追加

            // くまの設定
            var kuma = new Sprite(32, 32);             // スプライトをつくる
            kuma.image = game_.assets['./images/chara1.png']; // 画像を設定
            kuma.x = 80;                               // 横位置調整 画面左側に配置
            kuma.y = GROUND_LINE - kuma.height;        // 縦位置調整 くまの下端を地面の高さに合わせる
            scene.addChild(kuma);                      // シーンに追加

            // くまの当たり判定用スプライトの設定
            var kuma_hit = new Sprite(1, 1);           // スプライトをつくる(幅1, 高さ1)
            // kuma_hit.image =                        // 画像は設定しない（透明）
            kuma_hit.x = kuma.x + kuma.width / 2;      // 横位置調整 くまの左右中央に配置
            kuma_hit.y = kuma.y + kuma.height / 2;     // 縦位置調整くまの上下中央に配置
            scene.addChild(kuma_hit);                  // シーンに追加

            // ハードルの設定
            var hurdle = new Sprite(50, 100);          // スプライトをつくる
            hurdle.image = game_.assets['./images/hurdle.png']; // 画像を設定
            hurdle.x = -hurdle.width;                  // 横位置調整 画面外に隠しておく
            hurdle.y = GROUND_LINE - hurdle.height;    // 縦位置調整 ハードルの下端を地面の高さと合わせる
            scene.addChild(hurdle);                    // シーンに追加

            // いがぐりの設定
            var igaguri = new Sprite(42, 31);          // スプライトをつくる
            igaguri.image = game_.assets['./images/igaguri.png']; // 画像を設定
            igaguri.x = -igaguri.width;                // 横位置調整 画面外に隠しておく
            igaguri.y = GROUND_LINE - igaguri.height;  // 縦位置調整 いがぐり下端を地面の高さと合わせる
            scene.addChild(igaguri);                   // シーンに追加

            // 鳥の設定
            var bird = new Sprite(64, 44);             // スプライトをつくる
            bird.image = game_.assets['./images/bird.png']; // 画像を設定
            bird.x = -bird.width;                      // 鳥を左側の画面外に隠します
            bird.y = 120;                              // 鳥の飛ぶ高さを設定します
            scene.addChild(bird);                      // シーンに鳥を追加します

            // くまがやられた関数
            var kumaDead = function() {
                //alert("負け");              // ポップアップメッセージを出す
                kuma.frame = 3;                       // くまを涙目にする
                game_.pushScene(createGameoverScene()); // ゲームオーバーシーンをゲームシーンに重ねる(push)
            }

            // 毎フレームイベントをシーンに追加
            scene.addEventListener(Event.ENTER_FRAME, function(){

                scroll += SCROLL_SPEED;                       // 走った距離を記録
                scoreLabel.text = scroll.toString()+'㍍走破'; // スコア表示を更新

                // 障害物の出現タイミングの設定
                // 数字1 % 数字2 と書くと、数字1を数字2で割った余り（余剰）を得ることができます。
                // すなわち、scrollを640で割った余りは、scrollが640, 1280, 1920, …に達した時に0になります。
                if (scroll % 640 === 0) {              // 640m走るごとに
                    hurdle.x = 320;                    // ハードルを右端に移動(出現)
                }
                if (scroll % 560 === 0) {              // 560m走るごとに
                    igaguri.x = 320;                   // いがぐりを右端に移動(出現)
                }
                if (scroll % 3000 === 0) {             // 3000m走るごとに
                    bird.x = 320;                      // 鳥を右端に移動(出現)
                }

                // 当たり判定用スプライトをくまの上下中心に置く
                kuma_hit.x = kuma.x + kuma.width/2;
                kuma_hit.y = kuma.y + kuma.height/2;

                // 障害物のスクロールとくまとの接触の設定
                if (hurdle.x > -hurdle.width) {       // ハードルが出現している(画面内にある)とき
                    hurdle.x -= SCROLL_SPEED;         // ハードルをスクロール
                    if (hurdle.intersect(kuma_hit)) { // ハードルとくまがぶつかったとき
                        kumaDead();                   // くまがやられた関数を実行
                    }
                }
                if (igaguri.x > -igaguri.width) {     // いがぐりが出現している(画面内にある)とき
                    igaguri.x -= SCROLL_SPEED;        // いがぐりをスクロール
                    if (igaguri.intersect(kuma_hit)) {// いがぐりとくまがぶつかったとき
                        kumaDead();                   // くまがやられた関数を実行
                    }
                }
                if (bird.x > -bird.width) {           // 鳥が出現している(画面内にある)とき
                    bird.x -= SCROLL_SPEED * 1.2;     // 鳥を1.2倍速でスクロール
                    if (bird.frame > 0) {             // 鳥のフレーム番号を0, 1, 0, 1と切り替えて羽ばたかせる
                        bird.frame = 0;
                    } else {
                        bird.frame = 1;
                    }
                    if (bird.intersect(kuma_hit)) {   // 鳥とくまがぶつかったとき
                        kumaDead();                   // くまがやられた関数を実行
                    }
                }



                // くまのフレームを0, 1, 2, 0, 1, 2..と繰り返す
                kuma.frame ++;
                if (kuma.frame > 2) {
                    kuma.frame = 0;
                }

                // 背景をスクロールさせる
                bg1.x -= SCROLL_SPEED;                // 背景1をスクロール
                bg2.x -= SCROLL_SPEED;                // 背景2をスクロール
                if (bg1.x <= -320) {                  // 背景1が画面外に出たら
                    bg1.x = 320;                      // 画面右端に移動
                }
                if (bg2.x <= -320) {                  // 背景2が画面外に出たら
                    bg2.x = 320;                      // 画面右端に移動
                }

            });

            // シーン全体にタッチイベントを追加
            scene.addEventListener(Event.TOUCH_START, function(e){
                // くまをジャンプさせる
                kuma.tl.moveBy(0, -120, 12, enchant.Easing.CUBIC_EASEOUT) // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 120, 12, enchant.Easing.CUBIC_EASEIN); // 12フレームかけて現在の位置から下に120px移動
            });

            //ゲームシーンを返します
            return scene;
        }


        /**
        * ゲームオーバーシーン
        *
        * ゲームオーバーシーンを作り、返す関数です。
        */
        var createGameoverScene = function() {

            var scene = new Scene();                                   // 新しいシーンを作る
            scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';              // シーンの背景色を設定

            // ゲームオーバー画像を設定
            var gameoverImage = new Sprite(189, 97);                   // スプライトを作る
            gameoverImage.image = game_.assets['./images/gameover.png'];  // 画像を設定
            gameoverImage.x = 66;                                      // 横位置調整
            gameoverImage.y = 100;                                     // 縦位置調整
            scene.addChild(gameoverImage);                             // シーンに追加

            // リトライボタンを設定
            var buttonRetry = new Sprite(320, 32);                     // スプライトを作る
            buttonRetry.image = game_.assets['./images/retry_button.png'];// 画像を設定
            buttonRetry.x = 0;                                         // 横位置調整
            buttonRetry.y = 284;                                       // 縦位置調整
            scene.addChild(buttonRetry);                               // シーンに追加

            // リトライボタンにタッチイベントを追加する
            buttonRetry.addEventListener(Event.TOUCH_END, function(){
                game_.popScene();                                      // このシーンを剥がす（pop）
                game_.replaceScene(createStartScene());                // ゲームシーンをタイトルシーンと入れ替える(replace)
            });

            // ゲームオーバー画像にタッチイベントを設定
            gameoverImage.addEventListener(Event.TOUCH_START, function(e) {
                // このシーンを剥がす（pop）
                game_.popScene();
                // TOPに戻る
                location.href="./top.html";
            });

            // ゲームオーバーシーンを返します。
            return scene;

        };

        // ゲームの_rootSceneをスタートシーンに置き換える
        game_.replaceScene(createStartScene());

    }

    game_.start(); // ゲームをスタートさせます

}
