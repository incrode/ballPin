
import { Draw } from "./Draw.js";
import { Board } from "./Board.js";
import { Sound } from "./Sound.js";

const BALL_IMG_PATH = "./img/ball.png"
const BALL_STATES = 3;

let SCREEN = null;


export const Ball = {
    img: null,
    state: 0,
    ballWidth: 50,
    ballHeight: 50,
    ballPos: null,
    hx: 0,
    hy: 0,
    frxnX: 0,
    frxnY: 0,
    move: false,
    imgEx: 0,
    getState: function (id) {
        if (id == 0) {
            return Draw.Vector2d(Draw.Vector2d(0, 0),Draw.Vector2d(263, 256));
        }

        if (id == 1) {
            return Draw.Vector2d(Draw.Vector2d(263*1, 0),Draw.Vector2d(263, 256));
        }

        if (id == 2) {
            return Draw.Vector2d(Draw.Vector2d(263*2, 0),Draw.Vector2d(263, 256));
        }
    },
    init: function (screen) {
        this.ballPos = Draw.Vector2d(screen.width / 2 - this.ballWidth / 2, screen.height - this.ballHeight - 10);

        this.img = new Draw.ImageRenderer({
            srcPath: BALL_IMG_PATH,
            dstPosition: this.ballPos,
            dstDimension: Draw.Vector2d(this.ballWidth, this.ballHeight)
        });

        this.img.src = this.getState(this.state);

        SCREEN = screen;
        this.enableEvents();

    },
    enableEvents: function () {
        let sx = 0;
        let sy = 0;

        let ex = 0;
        let ey = 0;

        SCREEN.onpointerdown = (e) => {
            sx = Math.floor(e.x);
            sy = Math.floor(e.y);
        }

        SCREEN.onpointerup = (e) => {
            ex = Math.floor(e.x)
            ey = Math.floor(e.y)

            this.hit(ex - sx, ey - sy);
        }

        this.move = false;
    },
    disableEvents: function () {
        SCREEN.onpointerdown = null;
        SCREEN.onpointerup = null;

        this.move = true;
    },

    hit: function (x, y) {
        Sound.play();
        this.hx = x / 15;
        this.hy = y / 15;
        this.frxnX = 0.25;
        this.frxnY = 0.25;
        this.frxnX *= Math.sign(x);
        this.frxnY *= Math.sign(y);
        this.disableEvents();
    },
    animate: function (minusDelay) {
        setTimeout(() => {
            this.img.src = this.getState(this.state);

            this.state = (this.state+1)%3;

        }, minusDelay);
    },
    collides: function(){
            
        Board.tentules.forEach((tentule,i) => {
            
            if (tentule == null) return;

            if (tentule.b > this.ballPos.b -25 && tentule.a >= this.ballPos.a - 25 && tentule.a <= this.ballPos.a + 50)
            {
                Board.downTentule(i);
            }
            
            
        });
    },
    render: function (ctx) {
        if (this.move && Board.tentules.length) {
            if (this.hx === 0 || Math.sign(this.hx) !== Math.sign(this.hx - this.frxnX)) {
                this.hx = 0;
            } else {
                this.hx -= this.frxnX;
            }

            if (this.hy === 0 || Math.sign(this.hy) !== Math.sign(this.hy - this.frxnY)) {
                this.hy = 0;
            } else {
                this.hy -= this.frxnY;
            }
            this.collides();
            this.animate(Math.abs(this.hx + this.hy));
            if (!this.hx && !this.hy) 
            {
                setTimeout(()=>{
                    this.ballPos.a = (SCREEN.width / 2) - (this.ballWidth / 2);
                    this.ballPos.b = (SCREEN.height - this.ballHeight - 10);
                },300);
                Sound.pause();
                this.enableEvents();
            }
        }

        // console.log(this.hx, this.hy);

        if (this.hx !== 0 && (this.ballPos.a + this.hx < Board.boundary.start.a || this.ballPos.a + 50 + this.hx > Board.boundary.end.a))
        {
            this.hx *= 0;
        }

        if (this.hy != 0 && (this.ballPos.b + this.hy < Board.boundary.start.b || this.ballPos.b + 50 + this.hy > Board.boundary.end.b))
        {
            this.hy *= 0;
        }
        

        this.ballPos.a += this.hx;
        this.ballPos.b += this.hy;

        this.img.render(ctx);
    }
}