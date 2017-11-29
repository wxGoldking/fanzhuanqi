var AI=Class.extend({
    init:function(){
        this.lock=true;//AI的落子锁，防止动画积累
    },
    luozi:function(){
        var self=this;
        //已落子，便上锁
        if(!this.lock) return;
        this.lock=false;
        //无子可落时，return 因为落子规则的存在，可能存在一方连续落子的可能，不能再玩家落子后调用AI落子方法，而是每帧调用AI落子方法，所以可能出现checkover（交换执棋权之后）之前AI尝试落子，人为修正
        if(game.scene.chessboard.maxweight[0]==0){
            self.lock=true;
            return;
        }
        var x=game.scene.chessboard.maxweight[1],y=game.scene.chessboard.maxweight[2];
        game.scene.chessboard.xingqi("move",y,x);
        //模拟思考时间
        setTimeout(function(){
            game.scene.chessboard.xingqi("click",y,x);
            self.lock=true;
        },1500);
    }
})