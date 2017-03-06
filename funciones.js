/*********************************    
Autor: Jesús Gamero Méndez  
Fecha creación: 01/03/2017    
Última modificación: 06/03/2017    
Versión: 1.00 
***********************************/ 

var cartones = []; //Tendremos una lista de cartones
var jugadores; //Variable donde almaceno el número de jugadores
var precio; //Variable donde almaceno el precio del cartón
var intervalo; //Intervalo de tiempo
var velocidad; //Velocidad del intervalo pasada en el select
var ganadores=0; //Número de ganadores que hay
var aciertos = []; //Array de aciertos de cada uno de los cartones
var bombo = []; //Array del Bombo donde van a ir las bolas
var hanSalido = []; //Números que ya han salido del bombo
var numeros_cartones = []; // Array múltiple que guarda en un array numeros ya ordenados de cada uno de los cartones sin los huecos

/**
 * Inicia el Bingo y todas las funciones realacionadas
 */
function comenzar() {
	
		//Guardo en variables los datos del formulario lateral
		jugadores = window.parent.document.getElementById("njugadores").value;
		precio = window.parent.document.getElementById("valorc").value;
	    velocidad = window.parent.document.getElementById("velo").value;
	
		//Relleno array bombo con los numeros
		llenarBombo();
		
		//Genero el objeto carton para cada uno de los jugadores seleccionado
		for (var i = 0; i < jugadores; i++) {
			cartones[i] = generaCarton();
			numeros_cartones[i]=leerCarton(cartones[i]);
		};
		
		//Muestro el div de la bola.
		muestraBola();
		
		//Oculto el div de información
		$("#info").css("display", "none");
		
		//Deshabilito el botón de comenzar
		document.getElementById("biniciar").disabled = true;
		
		//Muestro el primer carton el 0 que será el nuestro ya que el resto no nos interesa dibujarlos
		dibujaCarton(cartones[0]);
		iniciar();
}

/**
 * Inicia intervalo que muestra las volas según la velocidad establecida.
 */
function iniciar() {
	intervalo = setInterval(peticionAJAX,velocidad);
}

/**
 * Para el intervalo y las bolas dejan de salir
 */
function parar() {
	//Para las bolas
	clearInterval(intervalo);
}
/**
 * Recarga la página
 */
function resetear(){
	window.location.reload();  
}

/**
* Devuelve numeros aleatorios de un intervalo
* @param {integer} inicio numero de incio
* @param {integer} fin fin del intervalo
* @param {integer} numero cantidad de numeros aleatorios a generar
* @returns {integer} array de numeros aleatorios
*/
function aleatorio(inicio, fin, numero)
{
	var numeros = [];
	var i = 0;
	if(!numero || numero<=0)
	{
		return Math.floor(Math.random()*(fin-inicio+1)) + inicio;
	}
	else
	{
		while(numeros.length < numero)
		{
			var aleatorios = Math.floor(Math.random()*(fin-inicio+1)) + inicio;
			if(numeros.indexOf(aleatorios) == -1)
			{
				numeros.push(aleatorios);
			}
		}
		return numeros.sort(function(a,b){return a-b;}); //Ordeno los numeros aleatorios que me han dado como resultados
	}
}

/**
 * Literalmente llena el bomo/array con los numeros de las bolas
 */
function llenarBombo() {
  for(i = 1; i <= 90; i++) {
    bombo.push(i);
  }
}

/**
 * Realiza la peticion ajax al archivo "bolas.php"
 */
function peticionAJAX() {
  $.ajax({
    type: "POST",
    url: "bolas.php",
    data: { numeros : bombo },
    dataType: "text",
    success: sacaBola,
  });
}

function sacaBola(indice) {
      nbola = bombo[indice];
	  //Guardo en un array los números que han salido
	  hanSalido.push(nbola);
	  
	  if (hanSalido.length <= 90){
		//Quito la bola del array
		  bombo.splice(indice, 1);
		  document.getElementById("bola").innerHTML=nbola;
		  
		  ////////////////// PON COMO COMENTARIO ESTO PARA JUGAR TU SOLO //////////////////
		  compruebaResto();
	  }
	  else
	  {
		  resetear();
		  alert("Se han sacado todos los números");
	  }
}

/**
 * Genera el div donde se mostrará la bola
 */
function muestraBola() {
	$("#derecho").append("<br><div id='bola'>?</div>");
	$("#derecho").append("<br><br>");
}

/**
 * Genera el array multidimensional con los numeros aleatorios y los huecos
 * @returns {Array} Contiene un array con los numeros de las filas y columnas y huecos
 */
function generaCarton() {
	//Creo un array del carton donde voy a gardar las tres filas con sus columnas
	var carton=[[],[],[]];
		for (var j = 0; j < 9; j++) {
			var columna;
			if(j==0){
				columna = aleatorio(10*j+1, 10*(j+1)-1, 3);}
			else if(j==8){
				columna = aleatorio(10*j, 10*(j+1), 3);}
			else{
				columna = aleatorio(10*j, 10*(j+1)-1, 3);}

			columna.sort(function(a,b){return a-b;});
			
			for(var i = 0; i < 3; i++)
			{
				carton[i][j] = {
					'valor': columna[i],
					'marca' : false
				}
			}
		};

		for (var i = 0; i < 3; i++) {
			var huecos = aleatorio(0,8,4);
			while(huecos.length>0)
			{
				//Cogo el primer numero aleatorio generado y a esa columna le pongo el valor -1
				carton[i][huecos.shift()].valor = -1;
			}	
		};
	return carton;
	}

/**
 * Dibuja un cartón de un array pasado como parámetro
 * @param {Array} carton Contiene un array con los numeros de las filas y columnas y huecos
 */
function dibujaCarton(carton)
{
	//Generamos la tabla
	var tabla = document.createElement("table");
 	tabla.setAttribute("id", "carton");
 	tabla.setAttribute("border", "3");
	tabla.classList.add('carton');
	//Genero las filas
	for(var i=0;i<carton.length;i++){
		var fila = document.createElement("tr");
		//Genero las columnas
		for(var j=0;j<carton[i].length;j++){
			var celda = document.createElement("td");
			celda.setAttribute("id", i + "/" + j);
			
			//Si la celda es -1 es que está hueca
			if(carton[i][j].valor === -1){
				celda.classList.add('hueco'); //Le asociamos la clase .hueco que tiene la imagen del bombo
			}
			else{
				celda.innerHTML = carton[i][j].valor;
				celda.addEventListener("click", function(){marcar(this.id, carton);}, false); //Establecemos listener de tipo click 	
			}
			fila.appendChild(celda); //Añadimos la celda a la fila		
		}
		tabla.appendChild(fila); //Añadimos la fila al carton
	}
	//Agregamos la carton al div correspondiente
	var sitio = document.getElementById("derecho");
	sitio.appendChild(tabla);
	
	//Dibujo los botones del bingo
	$("#derecho").append("<br><br><div id='bbingo'><button class='btn btn-default btn-lg'><b>¡Bingo!</b></button></div>");
    $("#bbingo button").click(cantaBingo);
	$("#datos").append("<button id='reset' class='btn btn-default'><b>REINICIAR</b></button>");
    $("#reset").click(resetear);
}

/**
 * Marca o desmarca un número del cartón
 * @param {String} id id del elemento a marcar
 * @param {Array} carton carton selecionado
 */
function marcar(id, carton){
	var celda = document.getElementById(id);
 	var posicion = id.split('/');

 	if(carton[posicion[0]][posicion[1]].marca){
 		carton[posicion[0]][posicion[1]].marca = false;
 		celda.classList.remove('marca');
 	}
 	else{
 		carton[posicion[0]][posicion[1]].marca = true;
 		celda.classList.add('marca');
 	}
}

/**
 * Lee el carton que le pasa como parámetro y guarda en un array de manera ordenada los números de los cartones.
 * @param {Array} carton carton selecionado
 */
function leerCarton(carton){
	var lista=[];
		//Recorro las filas y las columnas
		for (var i = 0; i < carton.length; i++) {
			for (var j = 0; j < carton[i].length; j++) {
				//Si la celda no está vacia, guardo en el array
				if(carton[i][j].valor != -1){
					lista.push(carton[i][j].valor);
				}
			};
		};
		return lista.sort(function(a,b){return a-b;}); //Ordenamos el resultado
		//De esta forma guardo en un array la lista ordenada de numeros que tiene ese carton para que sea mas facil comprobarlo despues
}

/**
 * Comprueba nuestro carton y muestra la ventana emergente en cada caso.
 */
function cantaBingo(){
	//Paro el bingo
	parar();
	//Compruebo mi cartón que es el primero, como ya tengo los números extraidos y guardados en el array numeros_cartones es más sencillo.
	if(compruebaBingo(0)==true){
		ganadores++;
		 var ventana = window.open("correcto.html", "_blank", "width=500,height=400");
		 //Calcula el premio
		 ventana.onload = function () {
            ventana.document.getElementById('premio').innerHTML = calcularPremio();
        };
	}
	else{
		var ventana = window.open("incorrecto.html", "_blank", "width=520,height=410");
		//Manda el número de aciertos
		 ventana.onload = function () {
            ventana.document.getElementById('nac').innerHTML = aciertos[0];
        };
	}
}

/**
 * Comprueba si los números del cartón del indice pasado han salido y si tiene los 15 aciertos devuelve que ha ganado.
 * @param {integer} indice Indice del array numeros_cartones para ver que cartón compruebo.
 * @returns {boolean} correcto Devuelve si ha ganado o no.
 */
function compruebaBingo(indice){
	var numeros=numeros_cartones[indice];
	var correcto = false;
	aciertos[indice]=0;
	
	for (x=0;x<numeros.length;x++){
		if(hanSalido.indexOf(numeros[x])!=-1){
		aciertos[indice]++;
		}
	}
	
	if (aciertos[indice]==15){
		correcto = true;
	}
	return correcto;
}

/**
 * Compruebo el resto de cartones para ver si alguno ha ganado
 */
function compruebaResto(){
	//Empiezo en un por que el cero es el mio
	for (y = 1; y < jugadores; y++) {
		if(compruebaBingo(y)==true){
			console.log(y);
			var jugadorganador=y;
			ganadores++;
			
			//Si solo hay un ganador ...
			if (ganadores==1){
				var ventana = window.open("otro.html", "_blank", "width=470,height=420");
				//Calcula el premio y manda el número de jugador, teniendo en cuenta que yo siempre soy el jugador número 0.
				 ventana.onload = function () {
					ventana.document.getElementById('premio').innerHTML = calcularPremio();
					ventana.document.getElementById('nj').innerHTML = jugadorganador;
				};
			}
			else //Si hay varios, evito que me saque multiples ventanas, ya que en caso de ser numerosos jugadores sería poco práctico.
			{
				ventana.close();
				var ventana = window.open("varios.html", "_blank", "width=470,height=420");
				//Calcula el premio y manda el número de jugador, teniendo en cuenta que yo siempre soy el jugador número 1.
				 ventana.onload = function () {
					ventana.document.getElementById('premio').innerHTML = calcularPremio();
				};
			}
			parar();
		}
	}
}

/**
 * Calcula el premio según la fórmula especificada en la práctica
 * @returns {integer} resultado Devuelve el resultado del premio
 */
function calcularPremio(){
	var resultado=(jugadores*precio)/ganadores;
	return resultado*0.8;
}


