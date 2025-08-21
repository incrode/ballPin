
import { Sound } from "./Sound.js";
import { Board } from "./Board.js";
import { Ball } from "./Ball.js";

export const Game = {
    SCREEN:null,
    CTX:null,
    lastTm:null,
    DELAY: 17,
    init: function({screen,sound}){
        this.SCREEN = screen;
        this.SCREEN.height = parseInt(getComputedStyle(this.SCREEN).height);
        this.SCREEN.width = parseInt(getComputedStyle(this.SCREEN).width);
        this.CTX = screen.getContext("2d");
        
        if (sound)  Sound.init();
        
        Board.init(screen);
        Ball.init(screen);

        this.render(null);
    },

    render: function(currTm){
        requestAnimationFrame(this.render.bind(this));
        if (currTm - this.lastTm < this.DELAY) return;
        this.CTX.clearRect(0,0,this.SCREEN.width,this.SCREEN.height)

        Board.render(this.CTX);
        Ball.render(this.CTX);
        
        if (!Board.tentules.length)
        {
            setTimeout(function(){
            window.document.body.innerHTML = `
           <h1> Game Over! </h1>
            `;
            },600);
        }
        
        this.lastTm = currTm;
    }
};