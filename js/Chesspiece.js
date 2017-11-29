var Chesspiece=Class.extend({
    init:function(type,x,y){
        this.type=type;
        //白棋
        if(type==1){
            this.image=game.R["white"];
            this.weight=0;
        //黑棋
        }else if(type==-1){
            this.image=game.R["black"];
            this.weight=0;
        //黑色预备棋
        }else if(type=="hei"){
            this.image=game.R["canblack"];
        //白色预备棋
        }else if(type=="bai"){
            this.image=game.R["canwhite"];
        }
        this.x=214+x;
        this.y=160+y;
        game.scene.chess.push(this);
    },
    update:function(){

    },
    render:function(){
        if(this.type=="hei"||this.type=="bai"){
        //预备落子半透明
            game.ctx.save();
            game.ctx.globalAlpha=0.5;
            game.ctx.drawImage(this.image,this.x,this.y,48,48);
            game.ctx.restore();
        }else{
            game.ctx.drawImage(this.image,this.x,this.y,48,48);
        }
    },
    godie:function(){
        game.scene.chess=_.without(game.scene.chess,this);
    }
})