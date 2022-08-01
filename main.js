const canvas=document.getElementById("myCanvas");
canvas.width=200;
const ctx= canvas.getContext('2d');

function lerp(A,B,t){
    return A+(B-A)*t;
}

class Road{
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2

        const infinity=1000000;
        this.top=-infinity;
        this.bottom=infinity;
        
        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.left,y:this.top};
        const bottomLeft={x:this.left,y:this.top};
        const bottomRight={x:this.left,y:this.top};

        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];

    }
    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=1; i<=this.laneCount-1; i++){
            const x=lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            
                ctx.setLineDash([20,20]);
                ctx.beginPath();
                ctx.moveTo(x,this.top);
                ctx.lineTo(x,this.bottom);
                ctx.stroke();
            
                
            }
            ctx.setLineDash([]);
            this.borders.forEach(border=>{
                ctx.beginPath();
                ctx.moveTo(border[0].x,border[0].y);
                ctx.lineTo(border[1].x,border[1].y);
                ctx.stroke();
            });

    }
}
class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5;
        this.rayLenght=100;
        this.raySpread=Math.PI/4;

        this.rays=[];
    }
    update(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            )+this.car.angle;

            const start={x:this.car.x, y:this.car.y};
            const end={
                x:this.car.x-
                    Math.sin(rayAngle)*this.rayLenght,
                y:this.car.y-
                    Math.cos(rayAngle)*this.rayLenght


            };
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                
                start.x,
                start.y
            );
            ctx.lineTo(
                end.x,
                end.y
                );
            ctx.stroke();

            this.rays.push([start,end]);
            
        }
        

        }
        /*
   */
}



class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0; 
        
        this.sensor=new Sensor(this);
        this.controls=new controls(); 
    }
    update(){
        this.sensor.update();
        if(this.controls.forward){
            this.speed+=this.acceleration;
            
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.y-=this.speed;
        }
        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
            this.angle+=0.03*flip;
            }
            if(this.controls.right){
            this.angle-=0.03*flip;
            }
}

        this.y-=this.speed;
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.sin(this.angle)*this.speed;
    
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
            
        );
        ctx.fill();

        ctx.restore();
        this.sensor.update(ctx);

       
    }
}
class controls{
    constructor(){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;
         
        
        this.#addkeyboardListener();
    }
    #addkeyboardListener(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                 case "ArrowRight":
                    this.right=true;
                    break;
                 case "ArrowUp":
                        this.forward=true;
                        break;
                case "ArrowDown":
                        this.reverse=true;
                        break;
            }
            }
            document.onkeyup=(event)=>{
                switch(event.key){
                    case "ArrowLeft":
                        this.left=false;
                        break;
                     case "ArrowRight":
                        this.right=false;
                        break;
                     case "ArrowUp":
                            this.forward=false;
                            break;
                    case "ArrowDown":
                            this.reverse=false;
                            break;
        }
    }

    }
    }
    const road=new Road(canvas.width/2,canvas.width*0.9);
    const car =new Car (road.getLaneCenter(1),100,30,50 );
    car.draw(ctx);

    animate();
    function animate(){
        car.update();
        canvas.height=window.innerHeight;

        ctx.save();
        ctx.translate(0,-car.y+canvas.height*0.7);

        road.draw(ctx);
        car.draw(ctx);

        ctx.restore();
        requestAnimationFrame(animate);
    }


