var Game=Class.extend({
    init:function(){
            this.canvas=document.getElementById("mycanvas");
            this.ctx=this.canvas.getContext("2d");
            this.width=this.canvas.width;
            this.height=this.canvas.height;
            this.bgm=document.getElementById("bgm");
            this.luozi=document.getElementById("luozi");
            this.tips=document.getElementById("tips");
            this.R={
                "chessboard":"images/chessboard.png",
                "black":"images/black.png",
                "white":"images/white.png",
                "canblack":"images/canblack.png",
                "canwhite":"images/canwhite.png",
                "taiji":"images/taiji.png",
                "background":"images/background.jpg",
                "zhihei":"images/zhihei.png",
                "zhibai":"images/zhibai.png",
                "rule":"images/rule.png",
                "help":"images/help.png",
                "bg1":"images/bg1.png",
                "restart":"images/restart.png",
                "lose":"images/lose.png",
                "win":"images/win.png",
                "heqi":"images/heqi.png",
                "weigui":"images/weigui.png",
                "change":"images/change.png",
                "title":"images/title.png",
            }
            var self=this;
            this.loadResource(function(){
                self.scene=new Scene(self);
                self.scene.changeScene(0);
                self.start();
        })
    },
    loadResource:function(callback){
        //资源列表长度
        var length=Object.keys(this.R).length;
        var count=0;
        var self=this;
        //加载图片
        for(var k in this.R){
            var image=new Image();
            image.src=this.R[k];
            this.R[k]=image;
            image.onload=function(){
                self.clear();
                count++;
                self.ctx.font="18px 微软雅黑"
                self.ctx.fillText("Loading"+count+"/"+length,self.width*0.4, self.height*0.5)
                if(count==length){
                    callback();
                }
            }
        }
    },
    clear:function(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    },
    start:function(){
        this.clear();
        cancelAnimationFrame(this.timer)
        var self=this;
        this.timer=requestAnimationFrame(function fn(){
            self.scene.showActors();
            self.timer=requestAnimationFrame(fn);
        })
    }
})