<template>
 <canvas ref="myCanvas" width="640" height="480" style="border: 1px solid black; background-color: black;"></canvas>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue'
import { Ship, TestBlock, AlienGreenCrab } from './entities.js'

export default defineComponent({
    name: 'Game',
    setup() {
        const myCanvas = ref(null)
        const keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            [' ']: false
        }

        onMounted(() => {
            console.log("starting...");
            // get context2d of canvas
            const ctx = myCanvas.value.getContext('2d');
            const canvasWidth = myCanvas.value.width;
            const canvasHeight = myCanvas.value.height;

            // initialize game variables
            const ship = new Ship(canvasWidth/2, canvasHeight-50);
            const testblock = new TestBlock(canvasWidth/2 + 100, canvasHeight-250);
            const alien1 = new AlienGreenCrab(canvasWidth/2 - 100, canvasHeight-250);

            const aliens = [];
            for (let row = 0; row < 5; row++){
                for (let col = 0; col < 10; col++){
                    const alien = new AlienGreenCrab(125+col * 40, 25+row * 40);
                    aliens.push(alien);
                }
            }

            // get keyboard input
            document.addEventListener('keydown', function(event) {
                keys[event.key] = true;
            });
            document.addEventListener('keyup', function(event) {
                keys[event.key] = false;
            });
            

            let frameCount = 0;            
            // check hitbox collision
            function collision(ent1, ent2) {
                return !(ent1.hitboxRight < ent2.hitboxLeft || ent1.hitboxLeft > ent2.hitboxRight || ent1.hitboxDown < ent2.hitboxUp || ent1.hitboxUp > ent2.hitboxDown);
            }

            // update loop
            function step() {
                frameCount++;
                if (frameCount < 2) {
                    window.requestAnimationFrame(step);
                    return;
                }
                
                // ship movement
                if (keys['d'] && ship.x < canvasWidth-ship.WH*ship.scale){
                    ship.move('right');
                } else if (keys['a'] && ship.x > 0){
                    ship.move('left');
                } else if (keys['w'] && ship.y > 0){
                    ship.move('up');
                } else if (keys['s'] && ship.y < canvasHeight-ship.WH*ship.scale){
                    ship.move('down');
                }

                // clear canvas and redraw
                frameCount = 0;
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ship.update(ctx);
                aliens.forEach((alien) => {alien.update(ctx)});
                if(collision(ship, testblock)){
                    console.log("collision detected!");
                }
                window.requestAnimationFrame(step);
            }
            
            function init() {
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
                step()
            }

            init();
        })
        return {
        myCanvas
        }
    }

})
</script>