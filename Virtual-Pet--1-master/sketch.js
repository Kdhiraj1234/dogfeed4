
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var bedroom, washroom, garden;
var gameState;
var currentTime;

//create feed and lastFed variable here
var feed;
var lastFed;

function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");

bedroom = loadImage('images/Bed Room.png');
washroom = loadImage('images/Wash Room.png');
garden = loadImage('images/Garden.png');

Milk = loadImage("Milk.png");
dogbathing = loadImage("dogBathing.png");
dogplaying = loadImage("dogPlaying.png");
dogsleeping = loadImage("dogSleeping.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  gameStateref = database.ref('gameState');
  gameStateref.on("value",function(data){
    gameState = data.val();
  })

}

function draw() {
  background(46,139,87);

  writeStock(foodS);

  if(foodS === 0){
    dog.addImage(happyDog);
    Milk.visible = false;
  }
  else{
    dog.addImage(sadDog);
    Milk.visible = true;
  }

  //write code to read fedtime value from the database 
  var feedtimeref = database.ref("FeedTime");
  feedtimeref.on("value", function(data) {
  lastFed = data.val();
  })
  
 
  //write code to display text lastFed time here
   currentTime = hour();
  fill("white");
  stroke("blue"); 

  if(lastFed>=12) {
    text("Last Feed : " + currentTime + "PM",350,30);
  } else if(lastFed==0) {
    text("Last Feed : 12 AM",350,30);
  } else {
    text("Last Feed :" + hour() + "AM",350,30);
  }

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  if(currentTime = lastFed+1){
   foodObj.Garden();
    update("playing");
  }
  else if(currentTime = lastFed+2){
    foodObj.bedRoom();
    update("sleeping");
  }
  else if(currentTime =lastFed+3){
    foodObj.washRoom();
    update("bathing");
  }
  else{
    update("hungry");
    foodObj.show();
  }

  if(gameState === "happyDog"){
    dog.addImage(happyDog);
    dog.scale = 0.175
    dog.y = 250;
  }
  if(gameState === "hungry"){
     dog.addImage(sadDog);
     dog.scale = 0.175;
     Milk.visible = false;
     dog.y = 250;
  }
  var Bath = createButton("I want to take a bath");
  Bath.position(580,125)
  if(Bath.mousePressed(function(){
     gameState = "bathing";
     database.ref('/').update({'gameState':gameState});
  }));
  if(gameState === "bathing"){
     dog.addImage(dogbathing);
     background(washroom);
     dog.scale = 1;
     Milk.visible = false;
  }

  var Sleep = createButton("I am very sleepy");
  Sleep.position(710,125);
  if(Sleep,mousePressed(function(){
     gameState = "sleeping";
     database.ref('/').update({'gameState':gameState});
  }));
  if(gameState === "sleeping"){
    dog.addImage(dogsleeping);
    background(bedroom);
    dog.scale = 1;
    Milk.visible = false;
  }

  var Play = createButton("Lets play!")
  Play.position(500,160);
  if(Play.mousepressed(function(){
    gameState = "playing";
    database.ref('/').update({'gameState':gameState});
  }));
  if(gameState === "playing"){
    dog.addImage(dogplaying);
    dog.scale = 1;
    Milk.visible = false;
  }

  var PlayInGarden = createButton("Let's play in park");
  PlayInGarden.position(585,160);
  if(PlayInGarden.mousePressed(function(){
    gameState = "PlayinGarden";
    database.ref('/').update({'gameState':gameState});
  }))
  if(gameState ==="PlayinGarden"){
    dog.y =175;
    dog.addImage(dogplaying);
    background(garden);
    dog.scale = 1;
    Milk.visible = false;
  }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0) {
  foodObj.updateFoodStock(food_stock_val * 0);
  } else {
  foodObj.updateFoodStock(food_stock_val - 1);
  }
  //write code here to update food stock and last fed time
  database.ref("/").update({
  Food:food_stock_val,
  FeedTime: hour()
  });

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  })
}