import { Draw } from "./Draw.js";

const BOARD_IMG_PATH = "./img/map.png";
const TENTULE_IMG_PATH = "./img/tentule.png";

export const Board = {
    groundImg: null,
    tentuleImg: null,
    boundary: {start:null,end:null},
    tentules:[],
    tentuleWidth: 20,
    tentuleHeight: 20,
    init: function(screen){
        this.groundImg = new Draw.ImageRenderer({
            srcPath:BOARD_IMG_PATH,
            srcPosition: Draw.Vector2d(275,0),
            srcDimension: Draw.Vector2d(768,768),
            dstPosition: Draw.Vector2d(0,0),
            dstDimension: Draw.Vector2d(830,screen.height +150)
        });

        this.tentuleImg = new Draw.ImageRenderer({
            srcPath: TENTULE_IMG_PATH,
            srcPosition: Draw.Vector2d(0,0),
            srcDimension: Draw.Vector2d(768,768),
            dstPosition: null,
            dstDimension: null
        });

        this.boundary.start = Draw.Vector2d(0,0);
        this.boundary.end = Draw.Vector2d(Number(screen.width),Number(screen.height));

        this.generate(screen);

    },
    downTentule: function(i){
       this.tentules.splice(i,1);
    },
    generate: function(screen){
        let width = this.tentuleWidth;
        let height = this.tentuleHeight; // A magic number just chosen since works...

        let cols = Math.floor(Number(screen.width) / width);
        let rows = Math.floor(Number(50) / height);

        for (let i = 0; i < rows; i++)
        {
            for (let j = 0; j < cols; j++)
            {
                this.tentules[i*cols + j] = Draw.Vector2d(width*j + 5,height*i + 2);
            }
        }

        
    },
    render: function(ctx){
        this.groundImg.render(ctx);

        for(let i = 0; i < this.tentules.length; i++)
        {
            if (this.tentules[i] == null) continue;

            this.tentuleImg.dst = Draw.Vector2d(this.tentules[i],Draw.Vector2d(this.tentuleWidth,this.tentuleHeight));
            this.tentuleImg.render(ctx);
        }
    }
};