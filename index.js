// notre modal au milieu de la fenetre
const modale = document.querySelector('.start');
const boutonModale = document.querySelector('.btnstart');
const touche = document.querySelector('.touche');
const boutonRestart = document.querySelector('.btnrestart');
////// CREATION DU CANVAS ET DU CONTEXTE /////////////////////////////////////////////
const canvas = document.querySelector('#game-container');
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');
///////// MA CLASSE ENTITY ///////////////////////////////////////////////////
class Entity{
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = "red";
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
/////////// MA CLASSE PLAYER ////////////////////////////////////////////////////////////
class Player extends Entity{
constructor(x, y, radius, color){
super(x, y, radius);
this.color = color;
}
}
const player = new Player(canvas.width / 2, canvas.height / 2, 10, 'red');
//////// MA CLASSE PROJECTILE ///////////////////////////////////////////////////////////////
class Projectile extends Player{
    constructor(x, y, radius, color, velocity){
        super(x, y, radius, color);
        this.velocity = velocity;
    }
    update(){
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}
let projectiles = [];
////////////// MA CLASSE ENNEMIES ///////////////////////////////////////////////////////////
class Ennemies extends Projectile{
    constructor(x, y, radius, color, velocity){
super(x, y, radius, color, velocity);
    }
}
let enemies = [];
/////////// MA CLASSE PARTICULES ////////////////////////////////////////////////////////
class Particle extends Ennemies{
constructor(x, y, radius, color, velocity){
super(x, y, radius, color, velocity);
this.alpha = 1;
}
draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}
let particles = [];
///////// MON EVENEMENT DE CLIQUE ///////////////////////////////////////////////////////
window.addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - player.y,
        event.clientX - player.x
    );
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    };
const projectile = new Projectile(player.x, player.y, 5, "white", velocity);
projectile.draw();
projectiles.push(projectile);
});
////////// MA FONCTION ANIMATE ////////////////////////////////////////////////////////////////////
let score = 0;
let scoco = document.querySelector('.parascore');
scoco.innerHTML = score;
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   player.draw();
   particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
   projectiles.forEach((projectile, index) => {
    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x + projectile.radius > canvas.width ||
      projectile.y - projectile.radius < 0 ||
      projectile.y + projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1);
    }
    projectile.update();
});
    enemies.forEach((ennemie, ennemieIndex) => {
        projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - ennemie.x, projectile.y - ennemie.y);
            if (distance - projectile.radius - ennemie.radius <= 0) {
// particles creation
for (let i = 0; i < 8; i++) {
    particles.push(
      new Particle(
        projectile.x,
        projectile.y,
        Math.random() * (3 - 1) + 1,
        ennemie.color,
        {
          x: (Math.random() - 0.5) * 3,
          y: (Math.random() - 0.5) * 3,
        }
      )
    );
  }
score += 100;
scoco.innerHTML = score;
                if(ennemie.radius - 10 > 5){
                    gsap.to(ennemie, {
                        radius: ennemie.radius - 10,
                      });
projectiles.splice(projectileIndex, 1);
                }else{
                    enemies.splice(ennemieIndex, 1);
                    projectiles.splice(projectileIndex, 1);
                }
             }
        });
        const distance2 = Math.hypot(player.x - ennemie.x, player.y - ennemie.y);
        if (distance2 - player.radius - ennemie.radius <= 0) {
            cancelAnimationFrame(animationId);
touche.style.display = 'flex';
         }
        ennemie.update()
    });
}
//////////// MA FONCTION CREATION ENNEMIES //////////////////////////////////////////////////////////////////
function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4;
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const color = `rgb(${r}, ${g}, ${b})`;
        const randomValue = Math.random();
        let x ,y;
        if (randomValue < 0.25) {
            x = 0 - radius;
            y = Math.random() * canvas.height;
        } else if (randomValue >= 0.25 && randomValue < 0.5) {
            x = canvas.width + radius;
            y = Math.random() * canvas.height;
        } else if (randomValue >= 0.5 && randomValue < 0.75) {
            x = Math.random() * canvas.width;
            y = 0 - radius;
        } else if (randomValue >= 0.75) {
            x = Math.random() * canvas.width;
            y = canvas.height + radius;
        }
        const angle = Math.atan2(player.y - y, player.x - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
        enemies.push(new Ennemies(x, y, radius, color, velocity));
    }, 1000);
}
boutonModale.addEventListener('click', () => {
    animate();
    spawnEnemies();
    modale.style.display = 'none';
});
boutonRestart.addEventListener('click', () => {
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoco.innerText = score;
    animate();
    spawnEnemies();
    touche.style.display = 'none';
});