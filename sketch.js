var lienzo;
/*--------fondo inicio--------*/
var alfabeto = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var matrix = {};
class Letra{
	constructor(posx,rety, size){
  	this.posx = posx
    this.posy = 0
    this.rety = rety
    this.size = size
    this.velocidad = 2
  }
  crear(cont){
    push()
      fill(60,178,39)
      textSize(this.size)
      textAlign(CENTER, CENTER)
      text(cont, this.posx,this.posy - this.rety )
      if (this.posy - this.rety <= height + this.size){
  	  	this.posy = this.posy + this.velocidad
      }else{
      	this.posy = 0
      }
    pop()
  }
}
/*-------UI Inicial-------------*/
let imgAtras, imgCaptura;
let texto = ' ';
let entervalor = 0;
/*------- posicion caracter -------------*/
let pos = 0;
let twl = 0;
let twc = 0;
let twr = 0;
/*------- Datos -------------*/
let versos;
let vAcro1={};
let vAcro2={};
let paso1 = 0;
let paso2 = 0;
let paso3 = 0;
function preload(){
  imgAtras = loadImage('img/atras.png');
  imgCaptura = loadImage('img/camara.png');
  versos = loadJSON('librerias/versos.json');
}
function setup() {
  //console.log(versos[Math.floor(Math.random() * 1000)]);
  /*--tamaño del lienzo---*/
  lienzo = createCanvas(windowWidth, windowHeight);
  lienzo.parent('canvas')
  /*--fondo Inicial---*/
  background(0,0,0);
  var size = 15;
  var cantidad = Math.round(width / size);
  for(a=0;a <= cantidad + 1; a++){
	 matrix["a"+ a]= new Letra(size*a,random(height),size)
  }
  /*-----Input area--------*/
  let inp = createInput('');
  inp.parent('input');
  inp.input(myInputEvent);

}
var posy = 0;
function draw() {
  background(0,0,0,8);
  Object.keys(matrix).forEach(function(elemento){	
		matrix[elemento].crear(alfabeto[Math.round(random(alfabeto.length))])
  })
  if (entervalor === 1){
    acrostico()
    botonAtras();
  }
  capturaCanvas();
}
function keyPressed() {
  let simbolos_no_permitidos = [' ','','=','/','%','$','#']
  if(keyCode === ENTER && !simbolos_no_permitidos.includes(texto)){
    entervalor = 1;
    let element = document.querySelector('#input');
    element.classList.remove("centro");
    element.classList.add("arriba");
  }
}
function myInputEvent() {
  texto = this.value();
  texto = texto.toLowerCase();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function botonAtras(){    
  push()
    image(imgAtras, width - 70, height - 70, 50, 50);
    if(mouseIsPressed && mouseButton == LEFT && mouseX > width - 70 && mouseX < width && mouseY > height - 70 && mouseY < height){
      entervalor = 0;
      vAcro1 = {};
      vAcro2 = {};
      paso1 = 0;
      paso2 = 0;
      paso3 = 0;
      texto = " "; 
      twl = 0;
      twc = 0;
      twr = 0;
      let element = document.querySelector('#input');
      element.classList.remove("arriba");
      element.classList.add("centro");
    }
  pop()
}
function capturaCanvas(){
  let nombre = 'acrostico-' + texto.toString().replace(/[,]/gi,'');
  push()
    image(imgCaptura, 10, height - 70, 50, 50);
  pop()
  if(mouseIsPressed && mouseButton == LEFT && mouseX > 0 && mouseX < 70 && mouseY > height - 70 && mouseY < height){
    saveCanvas(lienzo, nombre,'jpg');
  }
}
function filaCaligrama(s,v,c,f,p){
  textSize(s); 
  let subI = v.substring(0, p);
  let subF = v.substring(p + 1, v.length);
  let alinear = twl - textWidth(subI);
  push()
    fill(30,45,120)
    text(subI, 0 + alinear, s * f);
    push()
      fill(230,45,120);
      text(c, textWidth(subI) + alinear, s * f);
    pop()
    text(subF, textWidth(subI) + textWidth(c) + alinear, s * f); 
  pop()
}
function acrostico(){
  let cuadricula = texto.length + 2;
  let cuadriculaX = width / cuadricula ;
  let cuadriculaY = height / cuadricula;
  if(texto.length > 0){
    if(paso1 === 0){
      texto = texto.split(''); 
        for(let i =0; i <= texto.length - 1; i++){
          vAcro1[i] = [];
          vAcro2[i] = {
            's':20,
            'v':'nul',
            'c':texto[i],
            'f':i,
            'p':'nul',
            'ar':[]
          };
          let e = texto[i];
          //console.log(`e=${e} y i=${i}`);
          //console.log(Object.keys(versos).length);
          for(let p = 0; p <= Object.keys(versos).length - 1; p++){
            var v = versos[p];
            if(v.includes(e)){
              vAcro1[i].push(versos[p]);
            }
          }
          vAcro2[i]['v'] = vAcro1[i][Math.floor(Math.random() * vAcro1[i].length)];
        }
      paso1 = 1;
    }
    if(paso2 === 0){
      for(let i =0; i <= texto.length - 1; i++){
        let v = vAcro2[i]['v'];
        let c = vAcro2[i]['c'];
        //console.log(`c:${c} y v:${v}`);
        while(!vAcro2[i]['ar'].includes(v.lastIndexOf(c))){
          pos = v.indexOf(c, pos) 
          vAcro2[i]['ar'].push(v.indexOf(c, pos));
          pos = pos + 1;         
        }
        let ar = vAcro2[i]['ar'];
        vAcro2[i]['p'] = ar[Math.floor(Math.random()*ar.length)]
        let ml = vAcro2[i]['v'].substring(0,vAcro2[i]['p']);
        ml = textWidth(ml);
        if(ml > twl){
          twl = ml;
        }
        let mc = textWidth(vAcro2[i]['c']);
        if(mc > twc){
          twc = mc;
        }
        let mr = vAcro2[i]['v'].substring(vAcro2[i]['p'] + 1, vAcro2[i]['v'].length);
        mr = textWidth(mr);
        if(mr > twr){
          twr = mr;
        }
        pos = 0;
      }
      //console.log(`total =${twl + twc + twr}`);
      paso2 = 1;
    }
    if(paso3 === 0){
      let totalw =twl + twc + twr;
      let totalh = twc * 3;
      push()
        translate(width / 2 - totalw / 2, height / 3 - totalh / 2); 
        let llaves = Object.keys(vAcro2);
        for(let a = 0; a <= llaves.length - 1; a++){
          filaCaligrama(
            35,
            vAcro2[a]['v'],
            vAcro2[a]['c'],
            vAcro2[a]['f'],
            vAcro2[a]['p']);
        }
      pop()
    }
  }
}
