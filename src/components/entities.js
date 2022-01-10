export class Entity {
    constructor(x, y){
        this.isAlive = true;
        this.x = x;
        this.y = y;
        this.width = undefined;
        this.height = undefined;
        this.speed = 3;
        this.scale = 3;
        this.hitboxLeft = 0;
        this.hitboxRight = 0;
        this.hitboxUp = 0;
        this.hitboxDown = 0;
    }

    // move the entity 
    move(direction){
        if (direction == "right"){
            this.x += this.speed;
        } else if (direction == "left"){
            this.x -= this.speed;
        } else if (direction == "up"){
            this.y -= this.speed;
        } else if (direction == "down"){
            this.y += this.speed;
        }
    }

    update(ctx) {
        this.hitboxLeft = this.x;
        this.hitboxRight = this.x+this.width*this.scale;
        this.hitboxUp = this.y;
        this.hitboxDown = this.y+this.height*this.scale;
    }

    getHR(){
        return this.hitboxRight;
    }

}

export class Ship extends Entity{
    constructor(x, y){
        super(x,y);
        this.WH = 8;  
        this.width = this.WH;
        this.height = this.WH;
        this.x -= this.width/2;
        this.y -= this.height/2;
    }

    draw(ctx) {
        let img = new Image();
        img.src = require('../assets/pico8_invaders_sprites_LARGE.png');
        ctx.drawImage(img, 0, 0, this.WH , this.WH , this.x, this.y, this.WH*this.scale, this.WH*this.scale);
    }

    update(ctx) {
        super.update(ctx);
        this.draw(ctx);
    }

}

export class AlienGreenCrab extends Entity{
    constructor(x, y){
        super(x,y);
        this.WH = 8;  
        this.width = this.WH;
        this.height = this.WH;
        this.x -= this.width/2;
        this.y -= this.height/2;
    }

    draw(ctx) {
        let img = new Image();
        img.src = require('../assets/pico8_invaders_sprites_LARGE.png');
        ctx.drawImage(img, 24, 0, this.WH , this.WH , this.x, this.y, this.WH*this.scale, this.WH*this.scale);
    }

    update(ctx) {
        super.update(ctx);
        this.draw(ctx);
    }

}

export class TestBlock extends Entity{
    constructor(x, y){
        super(x,y);
        this.WH = 8;  
        this.width = 20;
        this.height = 20;
        this.x -= this.width/2;
        this.y -= this.height/2;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "green";
        ctx.rect(this.x, this.y, this.width*this.scale, this.height*this.scale);
        ctx.stroke();
    }

    update(ctx) {
        super.update(ctx);
        this.draw(ctx);
    }

}