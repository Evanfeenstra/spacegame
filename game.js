
var stars = [];
var ship;
var lasers;
var players = []
var enemyLasers;
var uid;
var dead;
var button;
var client;
var hp = 100
var choosing = false
const numStars = 1000
const SPACE_BAR = 32

function controls(){
  if(keyDown(UP_ARROW)){
    ship.addSpeed(0.2, ship.rotation-90)
    send({mode:'fly'})
  }
  if(keyDown(LEFT_ARROW)){
    ship.rotation -= 4
    send({mode:'turn',angle:-4})
  }
  if(keyDown(RIGHT_ARROW)){
    ship.rotation += 4
    send({mode:'turn',angle:4})
  }
  if(keyWentDown(SPACE_BAR)){
    let x = ship.position.x
    let y = ship.position.y
    let r = ship.rotation
    fireLaser(x,y,r,lasers)
    send({mode:'fire',x,y,r})
  }
}

function setup() {
  uid = randomString()

  loadImgs()
  createCanvas(window.innerWidth, window.innerHeight)
  background(0)

  stroke(255)
  for(let i=0; i<numStars; i++){
    stars.push([
      random(width),
      random(height)
    ])
  }

  lasers = new Group()
  enemyLasers = new Group()

  ship = makeShip(random(width), random(height))
  
  if(token) connectToFlespi()
  
  createButton()

} // end setup function

var iii = 0
function draw() {
  iii ++

  background(0)
  const n = Math.min(numStars,iii*10)
  for(let i=0; i<n; i++) {
    point(stars[i][0], stars[i][1])
  }
  
  if(typeof controls==='function') controls()

  for(var i=0; i<allSprites.length; i++){
    var sprite = allSprites[i]
    if(sprite.position.x<0){sprite.position.x=width}
    if(sprite.position.x>width){sprite.position.x=0}
    if(sprite.position.y<0){sprite.position.y=height}
    if(sprite.position.y>height){sprite.position.y=0}
  }
  
  ship.overlap(enemyLasers, shipHit)

  drawSprites()

  drawHealth()
} // end draw function

function drawHealth(){
  stroke(255)
  rect(10,10,100,10)
  fill(255)
  rect(10,10,hp,10)
}

function createButton(){
  button = createButton('respawn');
  button.position(10, 35);
  button.mousePressed(function(){
    if(!dead) return
    ship = makeShip(random(width), random(height))
    initialMsg()
    hp = 100
    dead = false
    button.hide()
  });
  button.hide()
}

function shipHit(){
  hp -= 10 
  if(hp<0) {
    ship.changeAnimation('boom')
    ship.life = 20
    send({mode: 'boom'})
    dead = true
    button.show()
    hp = 0
  }
}

function makeShip(x,y){
  var s = createSprite(x,y)
  s.maxSpeed = 5
  s.friction = 0.05
  s.setCollider('circle', 0, 0, 10)
  s.addImage(img.spaceship)
  s.addAnimation('boom',img.boom_one)
  s.scale = 1
  return s
}

function fireLaser(x,y,r,group){
  if(dead) return
  var laz = createSprite(x,y)
  laz.addImage(img.laser)
  laz.setSpeed(12, r - 90)
  laz.rotation = r
  laz.scale = 0.5
  laz.life = 30
  group.add(laz)
}

// to prevent browser hotkeys
// window.addEventListener("keydown",function(e){
//   e.preventDefault()
// })

function randomString(){
  return Math.random().toString(36).substring(2, 15)
}