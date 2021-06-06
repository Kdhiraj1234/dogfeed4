class Food{
constructor(){
    this.foodStock = 0;
    this.lastFed;
    this.image = loadImage("Milk.png");
}

updateFoodStock(foodStock){
    this.foodStock=foodStock;
   }

   getFedTime(lastFed){
     this.lastFed=lastFed;
   }

   deductFood(){
     if(this.foodStock>0){
      this.foodStock=this.foodStock-1;
     }
    }

    getFoodStock(){
      return this.foodStock;
    }

show(){
  var  x = 80, y = 100;

  imageMode(CENTER);
  image(this.image,720,220,70,70);

  if(this.foodStock!=0){
      for(var i=0; i<this.foodStock; i++){
          if(i%10==0){
              x = 80;
              y = y +50;
          }
          image(this.image,x,y,50,50);
          x = x+30;
      }
  }

  feed = createButton("Feed the dog");
  feed.position(400,125);

  if(feed.mousePressed(function(){
      foodS = foodS - 1;
      gameState = "happyDog";
      database.ref('/').update({
          'gameState':gameState
      })
  }));

}

bedRoom(){
    background(bedroom);
}
washRoom(){
    background(washroom);
}
Garden(){
    background(garden);
}

}