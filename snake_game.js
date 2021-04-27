var apple;
var orange;
var snake1;
var fish1;
var mouse1;
var highScore;
var count;

function setup() {
  createCanvas(1000, 600);
  frameRate(10);                   
  snake1 = new Snake(2, "right");
  fish1 = new Fish(5, "left");
  mouse1 = new Mouse(10, "left");
  apple = new Food(1);   
  rectMode(CENTER);
  count = 0;      
  highScore = 0;      
}

function draw() {
    background(0);
    drawScoreboard();  
  
    snake1.move();    
    snake1.display();
    mouse1.move();
    mouse1.display();
    fish1.move();
    fish1.display();
    apple.display();
    
    if (dist(apple.xpos, apple.ypos, snake1.xpos[0], snake1.ypos[0]) < snake1.sidelen) {
      apple.reset();
      snake1.addLink(apple.value);
      count++;
    }
    if (dist(mouse1.xpos[0], mouse1.ypos[0], snake1.xpos[0], snake1.ypos[0]) <  snake1.sidelen) {
      snake1.addLink(mouse1.value);
      mouse1 = null;
      mouse1 = new Mouse(10, "left"); 
    }
    if (count == 5)
    {
      count++;
      orange = new Food(5); 
    }
    if (orange != null)
    {
      orange.display();

      if (dist(orange.xpos, orange.ypos, snake1.xpos[0], snake1.ypos[0]) < snake1.sidelen) 
      {
        snake1.addLink(orange.value);
        orange = null;
        count = 0;
      }
    }
    for (let l = 1; l < snake1.xpos.length; l++)
    {  
      if (dist(fish1.xpos[0], fish1.ypos[0], snake1.xpos[l], snake1.ypos[l]) < snake1.sidelen) {
        snake1.len = l;
        while(snake1.xpos.length > l)
        {
          snake1.xpos.pop();
          snake1.ypos.pop();
        }
      }
    }    
    if(snake1.len > highScore){
      highScore= snake1.len;
    }
}

function keyPressed(){
    if(keyCode === LEFT_ARROW){
      snake1.dir = "left";
    }
    if(keyCode === RIGHT_ARROW){
      snake1.dir = "right";
    }
    if(keyCode === UP_ARROW){
      snake1.dir = "up";
    }
    if(keyCode === DOWN_ARROW){
      snake1.dir = "down";
    }
}

function drawScoreboard(){
  textFont('Courier');
  fill(255);
  textSize(65);
  text( "Snake Game", width * 0.6, 80);
  textSize(20);
  
  stroke(255);
  fill(0);
  rect(110, 70, 190, 80);
  fill(255);
  textSize(17);
  text( "Score: " + snake1.len, 30, 60);
  textSize(17);
  text("High Score: " + highScore, 30, 90);
}

// клас Їжа для представлення їжі для змії
class Food{ 
  constructor(v){
    this.value = v;
    this.xpos = random(100, width - 100);
    this.ypos = random(100, height - 100);
  }
  display(){   
   fill(190 + this.value * 13, this.value * 15, 100 - this.value * 20);
   ellipse(this.xpos, this.ypos, 15 + this.value * 2, 15 + this.value * 2);
 }
  reset(){
    this.xpos = random(100, width - 100);
    this.ypos = random(100, height - 100);
 }   
}

class Organism
{
  constructor(l, d)
  {
    this.len = l;
    this.dir = d;
    this.sidelen = 17;
    this.xpos = [];
    this.ypos = [];
    this.xpos.push( random(width) );
    this.ypos.push( random(height) );
  }
  move(){  
   for(let i = this.len - 1; i > 0; i = i - 1 ){
    this.xpos[i] = this.xpos[i - 1];
    this.ypos[i] = this.ypos[i - 1];  
   } 
   if(this.dir == "left"){
     this.xpos[0] = this.xpos[0] - this.sidelen;
   }
   if(this.dir == "right"){
     this.xpos[0] = this.xpos[0] + this.sidelen;
   } 
   if(this.dir == "up"){
     this.ypos[0] = this.ypos[0] - this.sidelen;
   }
   if(this.dir == "down"){
     this.ypos[0] = this.ypos[0] + this.sidelen;
   }
   this.xpos[0] = (this.xpos[0] + width) % width;
   this.ypos[0] = (this.ypos[0] + height) % height;
  } 
}

class Snake extends Organism{
  move(){    
   super.move();
    if( this.checkHit() == true){
      this.len = 1;
      let xtemp = this.xpos[0];
      let ytemp = this.ypos[0];
      this.xpos = [];
      this.ypos = [];
      this.xpos.push(xtemp);
      this.ypos.push(ytemp);
    }
  }  
  display(){    
    for(let i = 0; i < this.len; i++){
      stroke(255);
      fill(20, 150, 0, map(i-1, 0, this.len-1, 250, 50));
      rect(this.xpos[i], this.ypos[i], this.sidelen, this.sidelen);
    }  
  }
  addLink(value){  
    this.len += value;
  }
  checkHit(){    
    for(let i = 1; i < this.len; i++){
     if( dist(this.xpos[0], this.ypos[0], this.xpos[i], this.ypos[i]) < this.sidelen){
       return true;
     } 
    } 
    return false;
   } 
}

class Fish extends Organism
{ 
  display(){    
    for(let i = 0; i < this.len; i++){
      stroke(255);
      fill(0, 20, 150, map(i-1, 0, this.len-1, 250, 50));
      rect(this.xpos[i], this.ypos[i], this.sidelen, this.sidelen);
    }  
  }
}

class Mouse extends Organism
{
  constructor(v, d)
  {
    super(1, d);
    this.value = v;
  }
  display(){            
    for(let i = 0; i < this.len; i++){
        stroke(255);
        fill(200, 200, 200, 200);
        rect(this.xpos[i], this.ypos[i], this.sidelen, this.sidelen);
        if (this.dir == "left")
        {
          ellipse(this.xpos[i] - this.sidelen/2, this.ypos[i] - this.sidelen/2, 10, 10);
          ellipse(this.xpos[i] - this.sidelen/2, this.ypos[i] + this.sidelen/2, 10, 10);
          line(this.xpos[i] + this.sidelen/2, this.ypos[i], this.xpos[i] + this.sidelen/2 + 10, this.ypos[i]);
        }
        else if (this.dir == "right")
        {
          ellipse(this.xpos[i] + this.sidelen/2, this.ypos[i] - this.sidelen/2, 10, 10);
          ellipse(this.xpos[i] + this.sidelen/2, this.ypos[i] + this.sidelen/2, 10, 10);
          line(this.xpos[i] - this.sidelen/2, this.ypos[i], this.xpos[i] - this.sidelen/2 - 10, this.ypos[i]);
        }
        else if (this.dir == "up")
        {
          ellipse(this.xpos[i] - this.sidelen/2, this.ypos[i] - this.sidelen/2, 10, 10);
          ellipse(this.xpos[i] + this.sidelen/2, this.ypos[i] - this.sidelen/2, 10, 10);
          line(this.xpos[i], this.ypos[i] + this.sidelen/2, this.xpos[i], this.ypos[i] + this.sidelen/2 + 10);
        }
        else if (this.dir == "down")
        {
          ellipse(this.xpos[i] - this.sidelen/2, this.ypos[i] + this.sidelen/2, 10, 10);
          ellipse(this.xpos[i] + this.sidelen/2, this.ypos[i] + this.sidelen/2, 10, 10);
          line(this.xpos[i], this.ypos[i] - this.sidelen/2, this.xpos[i], this.ypos[i] - this.sidelen/2 - 10);
        }
      }
  }
  move() 
  {
    super.move();
    let temp = random();
    if(temp < 0.05) { this.dir = "right"; } 
    else if(temp < 0.1) { this.dir = "left"; }
    else if(temp < 0.15) { this.dir = "up"; }
    else if(temp < 0.2) { this.dir = "down"; }
  }
}
