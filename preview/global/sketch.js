//console.log(p5);
function setup(){
  createCanvas(200, 200);
}

async function draw(){
  background(255);
  circle(100, 100, 50);

  //let c1 = new Color("hsl", [10,11,14]);
 
  let c1 = color('rgba(0, 0, 255, 1)');
  fill(c1);
  textSize(30);
  text('hello', 10, 30);
}
