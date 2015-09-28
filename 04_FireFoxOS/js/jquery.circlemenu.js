;(function($) {
    $.fn.circlemenu = function(options) {
        var elements = this;
        var opts = $.extend({}, $.fn.circlemenu.defaults, options);
 
        elements.each(function() {
            var $obj = $(this);
            var menuButton = $obj.children('.menu-button');
            var menuItems = $obj.children('.menu-option').children();
            var itemAngle = [];
            var xPos = [];
            var yPos = [];
            var angle = opts.angleDifference / (menuItems.length - 1);
            var dx = document.getElementById("zahyoux").value; //menuButton.css("left");//デフォルト座標X
            var dy = document.getElementById("zahyouy").value; //menuButton.css("top");//デフォルト座標Y
            dx = Number(dx.replace(/px/, ""));
            dy = Number(dy.replace(/px/, ""));
            
            menuButton.unbind('click');
 
            function clickHandler(e) {
                e.preventDefault();
                if ($(this).parent().hasClass('active')) {
                //メニュー閉じる
                    $(this).parent().removeClass('active').addClass('inactive');
                    setPosition(false);
                } else {
                //メニュー開く
                    $(this).parent().removeClass('inactive').addClass('active');
                    setPosition(true);
                }
            }
 
            function setPosition(value) {
                menuItems.each(function(i, item) {
                    var ele = $(this);
                    delayTime = i * opts.delay;
                    window.setTimeout(function() {
                        $(item).css({
                            'left': value ? xPos[i] : dx,
                            'top' : value ? yPos[i]* -1: dy
                        });
                    }, delayTime);
                });
            }
 
            menuButton.bind('click', clickHandler);
 
            menuItems.each(function(i, item) {
                //itemAngle[i] = (opts.startAngle + angle * i) * Math.PI / 180;
                itemAngle[i] = (opts.startAngle - angle * i) * Math.PI / 180;

                //変更前に戻す場合は以下の2行を戻す
                //xPos[i] = opts.radius * Math.cos(itemAngle[i])+dx;
                //yPos[i] = opts.radius * Math.sin(itemAngle[i])-dy;

                //変更後(2段階 円メニュー)
                if(i<4){
                xPos[i] = opts.radius/5*3 * Math.cos(itemAngle[i])+dx;
                yPos[i] = opts.radius/5*3 * Math.sin(itemAngle[i])-dy;
                }else{
                xPos[i] = opts.radius/5*4 * Math.cos(itemAngle[i-4])+dx;
                yPos[i] = opts.radius/5*4 * Math.sin(itemAngle[i-4])-dy;
                }
                //$(item).css({'transform': 'rotate(' + (90-itemAngle[i]*180/Math.PI) + 'deg)'});
                $(item).css({'transform': 'rotate(' + (90-itemAngle[i%4]*180/Math.PI) + 'deg)'});
            });
 
        });
 
        return this;
    };
 
    // default options
    $.fn.circlemenu.defaults = {
        startAngle: 0,
        angleDifference: 90,
        radius: 200,
        delay: 40
    };
 
})(jQuery);