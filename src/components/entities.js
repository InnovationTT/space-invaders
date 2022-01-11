class Entity {
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
        // check if alive
        if (this.y + (this.height*this.scale) < 0 || this.y > 480){
            this.isAlive = false;
            //console.log("entity died!")
        }
        // update hitbox
        this.hitboxLeft = this.x;
        this.hitboxRight = this.x+this.width*this.scale;
        this.hitboxUp = this.y;
        this.hitboxDown = this.y+this.height*this.scale;
    }

    getHR(){
        return this.hitboxRight;
    }

}

class Projectile extends Entity {
    constructor(x, y){
        super(x,y)
        this.damage = 1;
        this.direction = undefined;
    }
}

export class ShipBullet extends Projectile {
    constructor(x, y){
        super(x,y)
        this.width = 2;
        this.height = 8;
        this.speed = 5;
        this.direction = "up";
    }

    draw(ctx) {
        let img = new Image();
        img.src = require('../assets/pico8_invaders_sprites_LARGE.png');
        ctx.drawImage(img, 3, 16, this.width , this.height , this.x, this.y, this.width*this.scale, this.height*this.scale);
    }

    update(ctx) {
        this.move(this.direction);
        super.update(ctx);
        this.draw(ctx);
    }
}

export class AlienBullet extends Projectile {
    constructor(x, y){
        super(x,y)
        this.width = 2;
        this.height = 3;
        this.speed = 3;
        this.direction = "down";
        this.isEnemy = true;
    }

    draw(ctx) {
        let img = new Image();
        img.src = require('../assets/pico8_invaders_sprites_LARGE.png');
        ctx.drawImage(img, 19, 19, this.width , this.height , this.x, this.y, this.width*this.scale, this.height*this.scale);
    }

    update(ctx) {
        this.move(this.direction);
        super.update(ctx);
        this.draw(ctx);
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
        this.TUNB = 0; // ticks/time until next bullet
    }

    fireBullet() {
        const bulletx = this.x + (this.width/2 - 1)*this.scale;
        const bullety = this.y+ (this.height/2 - 8)*this.scale;
        return new ShipBullet(bulletx, bullety);
    }

    draw(ctx) {
        let img = new Image();
        img.src = require('../assets/pico8_invaders_sprites_LARGE.png');
        ctx.drawImage(img, 0, 0, this.WH , this.WH , this.x, this.y, this.WH*this.scale, this.WH*this.scale);
    }

    update(ctx) {
        this.TUNB -= 3;
        super.update(ctx);
        this.draw(ctx);
    }

}

export class AlienGreenCrab extends Entity{
    constructor(x, y){
        super(x,y);
        this.speed = 1;
        this.WH = 8;  
        this.width = this.WH;
        this.height = this.WH;
        this.x -= this.width/2;
        this.y -= this.height/2;
        this.intervalLength = 210;
        this.intervalMoved = this.intervalLength/2; // this alien should oscillate between moving right and left, start at half since its moved half the screen essentially
        this.moveDirection = "none";
        this.changeDirection = true;
        this.isEnemy = true;
        this.shootChance = 0.001; // probability of alien shooting, checked every game tick
        //console.log("alien constructed!");
    }

    move(direction){
        super.move(direction);
        this.intervalMoved += this.speed;
    }

    fireBullet() {
        const bulletx = this.x + (this.width/2 - 1)*this.scale;
        const bullety = this.y + (this.height*this.scale);
        return new AlienBullet(bulletx, bullety);
    }

    draw(ctx) {
        let img = new Image();
        img.src = require('../assets/pico8_invaders_sprites_LARGE.png');
        ctx.drawImage(img, 24, 0, this.WH , this.WH , this.x, this.y, this.WH*this.scale, this.WH*this.scale);
    }

    update(ctx) {
        // update movement
        if(this.intervalMoved < this.intervalLength && this.changeDirection){
            if(this.moveDirection == "none" || this.moveDirection == "left"){
                this.moveDirection = "right";
            } else if(this.moveDirection == "right"){
                this.moveDirection = "left";         
            }
            this.changeDirection = false;
          
        } else if (this.intervalMoved >= this.intervalLength) {
            this.y += this.height;
            this.intervalMoved = 0;
            this.changeDirection = true;
        } 
        
     
        this.move(this.moveDirection);
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