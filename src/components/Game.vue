<template>
    <div style="text-align:center;">
        <q-btn color="secondary" @click="signIn">Sign in</q-btn>
        <q-btn tabIndex = -1 ref="playBtn" color="secondary" @click="init($event)">Play</q-btn>
    
        <div class="text-h6">Current User: {{loggedInUserName}}</div>    
        
    </div>
    <div class='parent' style="text-align:center;">
        <canvas tabIndex=0 ref="myCanvas" width="640" height="480" style="border: 1px solid black; background-color: black;"></canvas>
        <q-card>
        <q-item-section v-for="(val, index) in scores" :key="index">
            <div class="text-h6">{{val.name}}</div>
            <q-card-section>High Score: {{val.score}}</q-card-section>  
        </q-item-section>
        </q-card>
    </div>
    <div style="text-align:center;" class="text-h4">
      Score: {{score}}
    </div>
</template>

<script>
import { nextTick } from 'process';
import { defineComponent, ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, deleteDoc, getFirestore, setDoc, getDoc, collection, query, onSnapshot } from "firebase/firestore"; 
import { Ship, TestBlock, AlienGreenCrab, ShipBullet, AlienBullet} from './entities.js'

export default defineComponent({
    name: 'Game',
    setup() {
        //database stuff
        const status = ref('');
        const loggedInUserName = ref('Guest');
        const currentUserStatus = ref('');
        const provider = new GoogleAuthProvider();
        const db = getFirestore();
        const auth = getAuth();
        const scores = ref([]);
        

        // game stuff
        const myCanvas = ref(null);
        const keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            [' ']: false
        };
        const score = ref(0);
        let playing = false;

        async function init($event) {   
            $event.target.blur();
            console.log("playing game");
            if(!playing){
                playing = true;
                //event.target.blur();
            // get context2d of canvas
            const ctx = myCanvas.value.getContext('2d');
            const canvasWidth = myCanvas.value.width;
            const canvasHeight = myCanvas.value.height;

            // initialize game variables
            let killedAll = false;    // killed all enemies?
            const ship = new Ship(canvasWidth/2, canvasHeight-50);
            const testblock = new TestBlock(canvasWidth/2 + 100, canvasHeight-250);

            const entities = [ship];
            for (let row = 0; row < 5; row++){
                for (let col = 0; col < 10; col++){
                    const alien = new AlienGreenCrab(125+col * 40, 25+row * 40);
                    entities.push(alien);
                }
            }

            // get keyboard input
            document.addEventListener('keydown', function(event) {
                event.preventDefault();
                keys[event.key] = true;
            });
            document.addEventListener('keyup', function(event) {
                event.preventDefault();
                keys[event.key] = false;
            });
            

            let frameCount = 0;            
            // check hitbox collision
            function collision(ent1, ent2) {
                return !(ent1.hitboxRight < ent2.hitboxLeft || ent1.hitboxLeft > ent2.hitboxRight || ent1.hitboxDown < ent2.hitboxUp || ent1.hitboxUp > ent2.hitboxDown);
            }

            // update loop
            async function step() {
                // limit fps
                frameCount++;
                if (frameCount < 2) {
                    window.requestAnimationFrame(step);
                    return;
                }


                // if ship dies game over
                if (!ship.isAlive){
                    alert("Game Over!")

                    // save score if logged in and score is higher
                    if(loggedInUserName.value != ''){
                        const docRef = doc(db, "scores", loggedInUserName.value);
                        const docSnap = await getDoc(docRef);
                        let highScore = 0;
                        try {
                            highScore = docSnap.data().score;
                        } catch (error) {
                            console.log("new user!")
                        }

                        if(score.value > highScore || highScore == 0){
                            saveScore(loggedInUserName.value, score.value);
                        }
                        
                        
                    }
                    return;
                } else if (killedAll){
                    alert("You destroyed all alien invaders!");
                    saveScore(loggedInUserName.value, score.value);
                    return;
                }

                // ship controls
                if (keys['d'] && ship.x < canvasWidth-ship.WH*ship.scale){
                    ship.move('right');
                } else if (keys['a'] && ship.x > 0){
                    ship.move('left');
                } else if (keys['w'] && ship.y > 0){
                    ship.move('up');
                } else if (keys['s'] && ship.y < canvasHeight-ship.WH*ship.scale){
                    ship.move('down');
                } if (keys[' '] && ship.TUNB <= 0) {
                    ship.TUNB = 50;
                    entities.push(ship.fireBullet());
                }

                // clear canvas and redraw
                frameCount = 0;
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                killedAll = true;
                entities.forEach((entity, index) => {
                    entity.update(ctx)
                    if (entity.isEnemy){
                        killedAll = false;
                    }
                    if (!entity.isAlive){
                        entities.splice(index, 1);
                    }
                    // chance for aliens to shoot
                    if(entity instanceof AlienGreenCrab && Math.random() < entity.shootChance){
                        entities.push(entity.fireBullet());
                    }
                    if (entity instanceof ShipBullet || entity instanceof Ship){
                        entities.forEach((ent2) => {
                            if (ent2.isEnemy && collision(entity, ent2)){
                                score.value += 10;
                                ent2.isAlive = false;
                                entity.isAlive = false;
                            }
                        });
                    }
                    

                });
                window.requestAnimationFrame(step);
            }
            
            function init() {
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
                step()
            }

            init();
            }
            
        }

        //------------------ database stuff ------------------
        // get the currently signed in user 
    onAuthStateChanged(auth, (user) => {
      loggedInUserName.value = user?.displayName || '';
    });
    
    async function signIn(){
      console.log("Signing in with google"); 
      const result = await signInWithPopup(auth, provider);    
    }

    async function saveScore(id, score) {
      console.log("Saving score to Cloud Firestore");
      // Add a new document in collection "statuses"
      await setDoc(doc(db, "scores",  id), {
        score: score,
        name: loggedInUserName.value
      });
    }

    const getScores = onSnapshot(query(collection(db, "scores")), (querySnapshot) => {
      //console.log("Current data:", querySnapshot.docs.map(doc => doc.data()));
      scores.value = querySnapshot.docs.map(doc => doc.data());
    });

        return {
            myCanvas, score, init, signIn, loggedInUserName, saveScore, scores
        }
    }

})
</script>