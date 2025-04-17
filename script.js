var isMoving = true;
let isJumping = false;
let backgroundInterval;
const audio_coin = new Audio("audio/coin.wav");
const audio_jump = new Audio("audio/jump.wav");
const audio_lose = new Audio("audio/lose.wav");
const audio_explosion = new Audio("audio/explosion.ogg");
const area = document.getElementById('area');
const backgrounds = {
    0: "url('images/background/bg-desert.jpg')",
    1: "url('images/background/bg-snow.jpg')",
    2: "url('images/background/bg-graveyard.jpg')",
    3: "url('images/background/bg-mountain.jpg')"
};  

///////////////////////////////////////////////
/////////////////// BACKGROUND ////////////////
///////////////////////////////////////////////
function setBackgroundMoving() {
    let score = 0;
    if (isMoving == true) {
        setTimeout(function () {        

            // Membuat background bergerak
            var bg = document.getElementById('board');
            bg.style.backgroundPosition = (parseInt(bg.style.backgroundPosition.replace('px', '')) - 1) + 'px';                        

            // Menghitung score
            score = document.getElementById('score').innerHTML = parseInt(document.getElementById('score').innerHTML) + 1;        

            // Ganti background jika score berkelipatan 2000
            let key = Math.floor((score / 2000) %4);            
            if (key == 0) {
                bg.style.backgroundImage = backgrounds[key]                
            } else if (key == 1) {
                bg.style.backgroundImage = backgrounds[key]
            } else if (key == 2) {
                bg.style.backgroundImage = backgrounds[key]
            } else if (key == 3) {
                bg.style.backgroundImage = backgrounds[key]
            }
            
            // PANGGIL FUNGSI
            setBackgroundMoving();
        }, 3);
    }
}
setBackgroundMoving();
///////////////////////////////////////////////
/////////////////// END BACKGROUND ////////////
///////////////////////////////////////////////

///////////////////////////////////////////////
/////////////////// EFFECT ////////////////////
///////////////////////////////////////////////

// Effect explode
function show_explode(box){
    const explode = document.createElement("div");
    explode.className = "explode";
    explode.style.marginLeft = "80px";    
    explode.style.bottom = "7px";
    area.appendChild(explode); 

    // Menghilangkan gambar ketika animasi sudah dijalankan
    explode.addEventListener('animationend', function() {
        explode.style.display = 'none';
    });  
}
///////////////////////////////////////////////
/////////////////// END EFFECT ////////////////
///////////////////////////////////////////////

///////////////////////////////////////////////
/////////////////// COIN //////////////////////
///////////////////////////////////////////////

// Membuat koin
function createCoin(box, bottom, marginLeft) {
    const coin = document.createElement("div");
    coin.className = "coin_sprite"; 
    coin.style.marginLeft = (parseInt(box.style.marginLeft.replace('px', '')) + marginLeft) + "px";    
    coin.style.bottom = bottom;
    // coin.style.border= "solid 1px"
    area.appendChild(coin);
    moveCoin(coin);
}

// Membuat koin bergerak
function moveCoin(coin) {
    function move() {
        if (!isMoving) {
            return;
        }

        // Membuat koin bergerak ke kiri
        coin.style.marginLeft = (parseInt(coin.style.marginLeft.replace('px', '')) - 1) + 'px';

        // Check koin melewati screen
        if (parseInt(coin.style.marginLeft.replace('px', '')) < -100) {
            coin.remove(); // Hapus objek koin jika sudah melewati screen
        } else {
            // Check jika koin dilewati dino
            if (dino.offsetTop + 100 >= coin.offsetTop &&
                dino.offsetLeft + 100 >= coin.offsetLeft &&
                dino.offsetTop + 100 <= coin.offsetTop + 100 &&
                dino.offsetLeft <= coin.offsetLeft + 100) {

                // Increment untuk menambahkan jumlah koin yang didapat
                document.getElementById('coin').innerHTML = parseInt(document.getElementById('coin').innerHTML) + 1;
                audio_coin.currentTime = 0;
                audio_coin.play();                
                coin.remove();               
            } else {            
                setTimeout(move, 3); // Kecepatan koin bergerak
            }
        }
    }

    move(); // Start the movement
}

///////////////////////////////////////////////
///////////////// END COIN ////////////////////
///////////////////////////////////////////////

///////////////////////////////////////////////
///////////////// BOX /////////////////////////
///////////////////////////////////////////////

// Membuat box baru
function createBox() {    
    const box = document.createElement("div");
    box.className = "box";
    box.style.marginLeft = "1400px";
    box.style.bottom = "7px";
    area.appendChild(box);
    moveBox(box);

    // Menambahkan koin disekitar box dengan kemungkinan 40% muncul pada layar
    if (Math.random() < 0.4) {
        createCoin(box, 10, -170);   
        createCoin(box, 10, -120);  
        createCoin(box, 10, -70);                 
        createCoin(box, 80, -30); 
        createCoin(box, 120, 30); 
        createCoin(box, 80, 90);  
        createCoin(box, 10, 120);  
        createCoin(box, 10, 170);  
        createCoin(box, 10, 220);  
    }
}

// Membuat box bergerak
function moveBox(box) {
    function move() {
        if (!isMoving) {
            return;
        }

        box.style.marginLeft = (parseInt(box.style.marginLeft.replace('px', '')) - 1) + 'px';

        if (parseInt(box.style.marginLeft.replace('px', '')) < -100) {
            box.remove(); // Menghapus box ketika melewati screen
        } else {
            // Check jika box ditabrak dino
            if (dino.offsetTop + 50 >= box.offsetTop &&
                dino.offsetLeft + 50 >= box.offsetLeft &&
                dino.offsetTop + 50 <= box.offsetTop + 50 &&
                dino.offsetLeft <= box.offsetLeft + 50) {

                // Menampilkan game over
                document.getElementById('game-over').style.display = 'block';   
                
                // Menambahkan score pada tampilan flyout
                document.getElementById('final_score').innerHTML = parseInt(document.getElementById('score').innerHTML) + 1;

                // Menampilkan effect explode ketika menabrak box/rintangan
                show_explode(box.style.marginLeft);    

                // Effect suara explosion
                audio_explosion.play();

                // Dino dan box berhenti
                dino.setAttribute('class', 'freeze');
                box.setAttribute('class', 'freeze');                
                isMoving = false; 
                
                // Menjalankan effect suara lose ketika effect suara explosion selesai
                audio_explosion.onended = function() {
                    audio_lose.play();
                };            
                
                // activeIntervals.forEach(interval => clearInterval(interval));
                // activeIntervals = [];
            } else {                
                setTimeout(move, 3); // Kecepatan box bergerak
            }
        }
    }

    move();
}

// Mulai menjalankan Box
function startBoxMovement() {
    // Membuat Box
    createBox();

    // Check posisi box dengan posisi box terakgir
    const boxMovementInterval = setInterval(() => {        
        const boxes = document.querySelectorAll('.box');
        if (boxes.length > 0) {

            // Menghitung jarak posisi box terakhir
            const lastBox = boxes[boxes.length - 1];
            const lastBoxPosition = parseInt(lastBox.style.marginLeft.replace('px', ''));

            // Membuat box jika posisi box terakhir berada pada 500px di sebelah kanan edge atau margin left = 500px
            if (lastBoxPosition <= (window.innerWidth - 500)) {
                createBox();
            }
        }
    }, 1);
}
startBoxMovement();

///////////////////////////////////////////////
///////////////// END BOX /////////////////////
///////////////////////////////////////////////

///////////////////////////////////////////////
/////////////// EVENT /////////////////////////
///////////////////////////////////////////////

// Lompat dengan tombol space
window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32) { // Keycode 32 = Spasi
        if (isJumping) return; // jika sedang melompat tidak bisa lompat/tombol/fungsi jump spasi tidak aktif

        isJumping = true;
        audio_jump.currentTime = 0;
        audio_jump.play();
        
        const dino = document.getElementById('dino');
        dino.style.marginBottom = "200px";
        dino.setAttribute('class', 'freeze');

        // Event untuk mendeteksi apakah transisi sudah selesai dijalankan
        dino.addEventListener('transitionend', function onTransitionEnd() {
            if (dino.style.marginBottom === "200px") {
                // Turun
                dino.style.marginBottom = "55px";
            } else {
                // Setelah mendarat, reset status lompat
                isJumping = false;
                dino.setAttribute('class', '');
                dino.removeEventListener('transitionend', onTransitionEnd);
            }
        });
    }
});

// Lompat dengan mouse click kiri
function jump() {
    if (isJumping) return; // jika sedang melompat tidak bisa lompat/klik/fungsi jump tidak aktif

    isJumping = true;
    audio_jump.currentTime = 0;
    audio_jump.play();

    document.getElementById('dino').style.marginBottom = "200px";
    document.getElementById('dino').setAttribute('class', 'freeze');

    // Event untuk mendeteksi apakah transisi sudah selesai dijalankan
    dino.addEventListener('transitionend', function onTransitionEnd() {
        if (dino.style.marginBottom === "200px") {
            // Turun
            dino.style.marginBottom = "55px";
        } else {
            // Setelah mendarat, reset status lompat
            isJumping = false;
            dino.setAttribute('class', '');
            dino.removeEventListener('transitionend', onTransitionEnd);
        }
    });   
}

///////////////////////////////////////////////
///////////////// END EVENT ///////////////////
///////////////////////////////////////////////

///////////////////////////////////////////////
///////////////// GAME OVER ///////////////////
///////////////////////////////////////////////

function retryGame() {
    document.getElementById('game-over').style.display = 'none';    
    location.reload();
}

///////////////////////////////////////////////
/////////////// END GAME OVER /////////////////
///////////////////////////////////////////////
