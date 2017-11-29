var Scene=Class.extend({
    init:function(ob){
            this.ob=ob;
            this.actors=[];
            //棋子数组
            this.chess=[];
            //场景编号
            this.scenenum=0;
            this.bind();
    },
    //场景转换
    changeScene:function(num){
        this.scenenum=num;
        if(this.scenenum==0){
            this.chess=[];
            this.begin&&this.begin.godie();
            this.begin=new Begin(this.ob);
            this.chessboard&&this.chessboard.godie();
        }else if(this.scenenum==2){
            if(this.chessboard){
                this.chessboard.guiLing();
                this.actors.push(this.chessboard);
            }else{
                this.chessboard=new Chessboard();
            }
            //游戏开始new AI
            this.ai=new AI();
        }
    },
    showActors:function(){
        this.ob.ctx.drawImage(this.ob.R["background"],0,0);
        //开始页面
        if(this.scenenum==0){
            _.each(this.actors,function(item){
                item.update();
                item.render();
            });
        //规则说明页面
        }else if(this.scenenum==1){
             this.ob.ctx.drawImage(this.ob.R["rule"],0,0);
        //游戏进行页面
        }else if(this.scenenum==2){
            _.each(this.actors,function(item){
                item.update();
                item.render();
            });
            _.each(this.chess,function(item){
                item.render();
            });
            if(this.aiColor==this.chessboard.order){
                this.ai.luozi();
            }
        //游戏结束页面
        }else if(this.scenenum==3){
            _.each(this.actors,function(item){
                item.render();
            });
            _.each(this.chess,function(item){
                item.render();
            });
            //胜负判定
            if(this.playerColor=="hei"){
                this.chessboard.blackNum>this.chessboard.whiteNum&&this.ob.ctx.drawImage(this.ob.R["win"],150,285,500,100);
                this.chessboard.blackNum<this.chessboard.whiteNum&&this.ob.ctx.drawImage(this.ob.R["lose"],70,250,653,146);
            }else{
                this.chessboard.blackNum<this.chessboard.whiteNum&&this.ob.ctx.drawImage(this.ob.R["win"],150,285,500,100);
                this.chessboard.blackNum>this.chessboard.whiteNum&&this.ob.ctx.drawImage(this.ob.R["lose"],70,250,653,146);
            }
            this.chessboard.blackNum==this.chessboard.whiteNum&&this.ob.ctx.drawImage(this.ob.R["heqi"],260,210,270,150);
        }
    },
    //事件绑定
    bind:function(){
        var self=this;
        //预备落子
        $("canvas").on("mousemove",function(event){
            var x=parseInt((event.clientX-$(this).offset().left-214)/50);
            var y=parseInt((event.clientY-$(this).offset().top-160)/50)
            if(self.scenenum==2){
                if(x<0||x>7||y<0||y>7||self.playerColor!=self.chessboard.order) return;
                self.chessboard.xingqi("move",x,y)
            }
        });
         $("canvas").on("click",function(event){
            //鼠标在canvas内的坐标
            var curx=event.clientX-$(this).offset().left;
            var cury=event.clientY-$(this).offset().top;
            //棋盘坐标
            var x=parseInt((curx-214)/50);
            var y=parseInt((cury-160)/50)
            if(self.scenenum==0){
                //执黑先行
                if(curx>200&&curx<350&&cury>425&&cury<517){
                    self.playerColor="hei";
                    self.aiColor="bai";
                    self.changeScene(2);
                //执白后手
                }else if(curx>452&&curx<602&&cury>425&&cury<517){
                    self.playerColor="bai";
                    self.aiColor="hei";
                    self.changeScene(2);
                //跳转至规则说明场景
                }else if(curx>591&&curx<741&&cury>50&&cury<95){
                    self.changeScene(1);
                }
            }else if(self.scenenum==2){
                if(x<0||x>7||y<0||y>7||self.playerColor!=self.chessboard.order){
                //跳回场景0再来一场
                    if(curx>320&&curx<470&&cury>25&&cury<70){
                        self.changeScene(0);
                    }
                }else{
                //棋盘上落子
                    if(self.chessboard.weigui||self.chessboard.change) return;
                    self.chessboard.xingqi("click",x,y);
                }
            }else if(self.scenenum==1){
                //跳回场景0再来一场
                if(curx>705&&curx<759&&cury>18&&cury<67){
                    self.changeScene(0);
                }
            }else if(self.scenenum==3){
                //跳回场景0再来一场
                if(curx>320&&curx<470&&cury>25&&cury<70){
                        self.changeScene(0);
                    }
            }
        });
    }

})