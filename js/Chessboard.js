var Chessboard=Class.extend({
    init:function(){
            //落子顺序，最开始一定为黑
            this.order="hei";
            //棋盘
            this.image=game.R["chessboard"];
            this.width=488;
            this.height=488;
            this.imag1=game.R["bg1"];
            //重新开始按钮
            this.imag2=game.R["restart"];
            this.imag3=game.R["black"];
            this.imag4=game.R["white"];
            this.guiLing();
            game.scene.actors.push(this);
    },
    guiLing:function(){
        this.order="hei";
        //用于场景2入场的帧数
        this.f=0;
        //用于违规落子和交换行棋权提示的的帧数
        this.f1=0;
        //棋盘上总棋子数
        this.num=4;
        this.blackNum=2;
        this.whiteNum=2;
        //是否违规落子
        this.weigui=false;
        //是否要交换行棋权
        this.change=false;
        //最初的棋盘位置
        this.y=588;
        //简单记录棋子位置的矩阵
        this.maxtrix=[
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,-1,1,0,0,0],
                [0,0,0,1,-1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0]
            ]
            //最大权重[权重数，横坐标，纵坐标]
            this.maxweight=[0,0,0];
            var self=this;
            //棋子对象数组
            this.qizi=(function(){
                var arr=[[],[],[],[],[],[],[],[]]
                for (var i = 0; i < 8; i++) {
                    for (var j = 0; j < 8; j++) {
                            arr[i].push({
                                "weight":0
                            });
                    };
                };
                return arr;
            })();

    },
    update:function(){
        this.f++;
        if(this.f<=80){
        //80帧入场动画
            this.y-=7;
            if(this.y<100) this.y=100;
            if(this.f==80){
            //入场后产生最初的四颗棋子
                this.qizi[3][4]=new Chesspiece(1,4*50,3*50);
                this.qizi[4][3]=new Chesspiece(1,3*50,4*50);
                this.qizi[3][3]=new Chesspiece(-1,3*50,3*50);
                this.qizi[4][4]=new Chesspiece(-1,4*50,4*50);
            //更新64个位置的权重
                this.getweight();
            //落子音效
                game.luozi.play();
            }
        }else{
            //80帧后每帧更新双方棋子数目
            var count1=0,count2=0;
            for (var i = 0; i < this.maxtrix.length; i++) {
                for (var j = 0; j < this.maxtrix[i].length; j++) {
                    this.maxtrix[i][j]==-1&&count1++;
                    this.maxtrix[i][j]==1&&count2++;
                };
            };
            this.blackNum=count1;
            this.whiteNum=count2;
        }
    },
    //结束判定方法
    checkover:function(){
        var self=this;
        //棋盘铺满
        if(this.num==64){
            //延时器确保下一帧渲染完成后跳转至结束场景
            setTimeout(function(){
                //停止渲染预备落子
                self.ready.godie();
                //跳转至结束场景
                game.scene.changeScene(3);
            },20);
            return;
        }
        if(this.maxweight[0]==0){
                this.change=true;
                game.tips.load();
                game.tips.play();
                if(self.order=="hei"){
                    self.order="bai";
                    self.getweight();
                }else{
                    self.order="hei";
                    self.getweight();
                }
                if(self.maxweight[0]==0){
                    setTimeout(function(){
                        self.ready.godie();
                        game.scene.changeScene(3);
                    },20)
                }
        }
    },
    //计算单个棋子权重
    singleweight:function(i,j){
                    //把要翻转的棋子坐标放入数组，方便反转方法调用
                    this.fz=[];
                    var count=0;//单个棋子总权重
                    var save=0;//单方向权重
                    var temp=[];//存放单方向翻转棋子
                    //向下计算
                    for (var a1 = i+1; a1 < 8; a1++,save++) {
                        //紧挨的第一个必须异色
                        if(this.order=="hei"&&this.maxtrix[i+1][j]==1||this.order=="bai"&&this.maxtrix[i+1][j]==-1)
                        {
                            //之后遇到空位权重清零，反转数组清零，该方向计算完成
                            if(this.maxtrix[a1][j]==0){
                                save=0;
                                temp=[];
                                break;
                            //之后遇到同色该方向权重计算完成
                            }else if(this.order=="hei"&&this.maxtrix[a1][j]==-1||this.order=="bai"&&this.maxtrix[a1][j]==1){
                                break;
                            }
                            //该方向最后一个仍然未计算完成，权重清零，反转数组清零，该方向计算完成
                            if(a1==7){
                                save=0;
                                temp=[];
                                break;
                            }
                            temp.push([a1,j]);
                        }else{
                            break;
                        }
                    };
                    count+=save;
                    save=0;
                    this.fz=this.fz.concat(temp);
                    //向上计算
                    temp=[];
                    for (var a1 = i-1; a1 >=0; a1--,save++) {
                        if(this.order=="hei"&&this.maxtrix[i-1][j]==1||this.order=="bai"&&this.maxtrix[i-1][j]==-1)
                        {
                            if(this.maxtrix[a1][j]==0){
                                save=0;
                                temp=[];
                                break;
                            }else if(this.order=="hei"&&this.maxtrix[a1][j]==-1||this.order=="bai"&&this.maxtrix[a1][j]==1){
                                break;
                            }
                            if(a1==0){
                                save=0;
                                temp=[];
                                break;
                            }
                            temp.push([a1,j]);
                        }else{
                            break;
                        }
                    };
                    count+=save;
                    save=0;
                    this.fz=this.fz.concat(temp);
                    //向左计算
                    temp=[];
                    for (var a1 = j-1; a1 >=0; a1--,save++) {
                        if(this.order=="hei"&&this.maxtrix[i][j-1]==1||this.order=="bai"&&this.maxtrix[i][j-1]==-1)
                        {
                            if(this.maxtrix[i][a1]==0){
                                save=0;
                                temp=[];
                                break;
                            }else if(this.order=="hei"&&this.maxtrix[i][a1]==-1||this.order=="bai"&&this.maxtrix[i][a1]==1){
                                break;
                            }
                            if(a1==0){
                                save=0;
                                temp=[];
                                break;
                            }
                            temp.push([i,a1]);
                        }else{
                            break;
                        }
                    };
                    count+=save;
                    save=0;
                    this.fz=this.fz.concat(temp);
                    //向右计算
                    temp=[];
                    for (var a1 = j+1; a1 <8; a1++,save++) {
                        if(this.order=="hei"&&this.maxtrix[i][j+1]==1||this.order=="bai"&&this.maxtrix[i][j+1]==-1)
                        {
                            if(this.maxtrix[i][a1]==0){
                                save=0;
                                temp=[];
                                break;
                            }else if(this.order=="hei"&&this.maxtrix[i][a1]==-1||this.order=="bai"&&this.maxtrix[i][a1]==1){
                                break;
                            }
                            if(a1==7){
                                save=0;
                                temp=[];
                                break;
                            }
                            temp.push([i,a1]);
                        }else{
                            break;
                        }
                    };
                    count+=save;
                    save=0;
                    this.fz=this.fz.concat(temp);
                    //向右上计算
                    temp=[];
                    for (var a1=i-1,a2=j+1; a1>=0 && a2 <8; a1--,a2++,save++){
                        if(this.order=="hei"&&this.maxtrix[i-1][j+1]==1||this.order=="bai"&&this.maxtrix[i-1][j+1]==-1)
                        {
                            if(this.maxtrix[a1][a2]==0){
                                save=0;
                                temp=[];
                                break;
                            }else if(this.order=="hei"&&this.maxtrix[a1][a2]==-1||this.order=="bai"&&this.maxtrix[a1][a2]==1){
                                break;
                            }
                            if(a1==0||a2==7){
                                save=0;
                                temp=[];
                                break;
                            }
                            temp.push([a1,a2]);
                        }else{
                            break;
                        }
                    };
                    count+=save;
                    save=0;
                    this.fz=this.fz.concat(temp);
                    //向右下计算
                    temp=[];
                    for (var a1 = i+1 ,a2=j+1; a1<8 && a2<8; a1++,a2++,save++){
                        if(this.order=="hei"&&this.maxtrix[i+1][j+1]==1||this.order=="bai"&&this.maxtrix[i+1][j+1]==-1)
                        {
                            if(this.maxtrix[a1][a2]==0){
                                save=0;
                                temp=[];
                                break;
                            }else if(this.order=="hei"&&this.maxtrix[a1][a2]==-1||this.order=="bai"&&this.maxtrix[a1][a2]==1){
                                break;
                            }
                            if(a1==7||a2==7){
                                save=0;
                                temp=[];
                                break;
                            }
                            temp.push([a1,a2]);
                        }else{
                            break;
                        }
                    };
                    count+=save;
                    save=0;
                    this.fz=this.fz.concat(temp);
                     //向左下计算
                     temp=[];
                    for (var a1 = i+1 ,a2=j-1; a1<8 && a2>=0; a1++,a2--,save++) {
                        if(this.order=="hei"&&this.maxtrix[i+1][j-1]==1||this.order=="bai"&&this.maxtrix[i+1][j-1]==-1)
                        {
                            if(this.maxtrix[a1][a2]==0){
                                save=0;
                                temp=[];
                                break;
                            }else if(this.order=="hei"&&this.maxtrix[a1][a2]==-1||this.order=="bai"&&this.maxtrix[a1][a2]==1){
                                break;
                            }
                            if(a1==7||a2==0){
                                save=0;
                                temp=[];
                                break;
                            }
                            temp.push([a1,a2]);
                        }else{
                            break;
                        }
                    };
                    count+=save;
                    save=0;
                    this.fz=this.fz.concat(temp);
                    //向左上计算
                    temp=[];
                    for (var a1 = i-1 ,a2=j-1; a1>=0 && a2>=0; a1--,a2--,save++) {
                        if(this.order=="hei"&&this.maxtrix[i-1][j-1]==1||this.order=="bai"&&this.maxtrix[i-1][j-1]==-1)
                        {
                            if(this.maxtrix[a1][a2]==0){
                                save=0;
                                temp=[];
                                break;
                            }else if(this.order=="hei"&&this.maxtrix[a1][a2]==-1||this.order=="bai"&&this.maxtrix[a1][a2]==1){
                                break;
                            }
                            if(a1==0||a2==0){
                                save=0;
                                temp=[];
                                break;
                            }
                            temp.push([a1,a2]);
                        }else{
                            break;
                        }
                    };
                    count+=save;
                    save=0;
                    this.fz=this.fz.concat(temp);
                    //边角权重修正
                    if(i==0&&j==7||i==7&&j==0||i==0&&j==0||i==0&&j==0){
                        if(count!=0) count+=1000;
                    }else if(i==0||i==7||j==7||j==0){
                        if(count!=0) count+=100;
                    }else if(i==1||i==6||j==6||j==1){
                        if(count!=0) count=1;
                    }
                    //角落四个点周边的棋子权重简单修正
                    if(this.order=="hei"&&this.maxtrix[0][0]!=-1||this.order=="bai"&&this.maxtrix[0][0]!=1){
                        if((i==0&&j==1||i==1&&j==0||i==1&&j==1)&&count!=0) count=0.5;
                    }
                    if(this.order=="hei"&&this.maxtrix[0][7]!=-1||this.order=="bai"&&this.maxtrix[0][7]!=1){
                        if((i==0&&j==6||i==1&&j==7||i==1&&j==6)&&count!=0) count=0.5;
                    }
                    if(this.order=="hei"&&this.maxtrix[7][0]!=-1||this.order=="bai"&&this.maxtrix[7][0]!=1){
                        if((i==6&&j==0||i==7&&j==1||i==6&&j==1)&&count!=0) count=0.5;
                    }
                    if(this.order=="hei"&&this.maxtrix[7][7]!=-1||this.order=="bai"&&this.maxtrix[7][7]!=1){
                        if((i==7&&j==6||i==6&&j==7||i==6&&j==6)&&count!=0) count=0.5;
                    }
                    //得出权重
                    this.qizi[i][j].weight=count;

    },
    //计算64个位置的权重
    getweight:function(){
        //计算前最大权重清零
        this.maxweight=[0,0,0];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++){
                if(this.maxtrix[i][j]==0){
                    this.singleweight(i,j);
                    if(this.qizi[i][j].weight>this.maxweight[0]){
                        //更新最大权重
                        this.maxweight[0]=this.qizi[i][j].weight;
                        this.maxweight[1]=i;
                        this.maxweight[2]=j;
                    }else if(this.qizi[i][j].weight==this.maxweight[0]){
                        //权重相同时模拟选择
                        var random=_.random(0,1);
                        if(random){
                            this.maxweight[0]=this.qizi[i][j].weight;
                            this.maxweight[1]=i;
                            this.maxweight[2]=j;
                        }
                    }
                }
            };
        };
    },
    xingqi:function(state,x,y){
        //预备落子
        if(state=="move"){
            if(this.ready){
                this.ready.godie();
            }
            this.ready=new Chesspiece(this.order,x*50,y*50)
        //落子
        }else if(state=="click"){
            if(this.qizi[y][x].weight==0){
            //落子违规提示
                this.weigui=true;
                game.tips.load();
                game.tips.play();
                return;
            };
            if(this.order=="hei"){
                this.maxtrix[y][x]=-1;
                this.qizi[y][x]=(new Chesspiece(-1,x*50,y*50));
                //计算该位置权重以得到要反转的棋子数组，棋子初始权重为零，这一步会污染棋子权重，在反转方法中修正
                this.singleweight(y,x);
                //翻转
                this.fanzhuan(y,x);
                //交换行棋权
                this.order="bai";
            }else if(this.order=="bai"){
                this.maxtrix[y][x]=1;
                this.qizi[y][x]=(new Chesspiece(1,x*50,y*50));
                this.singleweight(y,x);
                this.fanzhuan(y,x);
                this.order="hei";
            }
            game.luozi.load();
            game.luozi.play();
            //棋盘棋子数更新
            this.num++;
            //更新64个位置权重
            this.getweight();
            //checkover检查
            this.checkover();
        }
    },
    fanzhuan:function(x,y){
        //修正落子之后权重为0
        this.qizi[x][y].weight=0;
        var a,b;
        for (var i = 0; i < this.fz.length; i++) {
            a=this.fz[i][0],b=this.fz[i][1];
            if(this.order=="hei"){
                //修正小矩阵
                this.maxtrix[a][b]=-1;
                //修正棋子image;
                this.qizi[a][b].image=game.R["black"];
                //修正棋子的type(其实type不影响已落定的棋子)
                this.qizi[a][b].type=-1;
            }else if(this.order=="bai"){
                this.maxtrix[a][b]=1;
                this.qizi[a][b].image=game.R["white"];
                this.qizi[a][b].type=1;
            }

        };
    },
    render:function(){
        //渲染棋盘
        game.ctx.drawImage(this.image,150,this.y,488,488);
        if(this.f>80){
            //渲染计分牌背景
            game.ctx.drawImage(this.imag1,90,25,150,60);
            game.ctx.drawImage(this.imag1,550,25,150,60);
            //渲染双方分数
            game.ctx.font="24px 微软雅黑";
            if(game.scene.playerColor=="hei"){
                game.ctx.fillStyle="#000";
                game.ctx.fillText("我方: "+this.blackNum+"",120,62);
                game.ctx.fillStyle="#fff";
                game.ctx.fillText("AI:  "+this.whiteNum+"",595,62);
                game.ctx.drawImage(this.imag3,40,450,50,50);
                game.ctx.drawImage(this.imag4,700,150,50,50);
            }else{
                game.ctx.fillStyle="#fff";
                game.ctx.fillText("我方: "+this.whiteNum+"",120,62);
                game.ctx.fillStyle="#000";
                game.ctx.fillText("AI:  "+this.blackNum+"",595,62);
                game.ctx.drawImage(this.imag4,40,450,50,50);
                game.ctx.drawImage(this.imag3,700,150,50,50);
            }
            //渲染场景0的入口
            game.ctx.drawImage(this.imag2,320,25,150,45);
        }
        //违规落子提示，持续45帧
        if(this.weigui){
            this.f1++;
            game.ctx.drawImage(game.R["weigui"],40,100,86,340);
            if(this.f1==45){
                this.weigui=false;
                this.f1=0;
            }
        }
        //交换行棋权提示，持续45帧
        if(this.change){
            this.f1++;
            game.ctx.drawImage(game.R["change"],675,210,100,375);
            if(this.f1==45){
                this.change=false;
                this.f1=0;
            }
        }
    },
    godie:function(){
        game.scene.actors=_.without(game.scene.actors,this);
   }
})