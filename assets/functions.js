/*********************************
Autor: Jesús Gamero Méndez
Modificado por: Adrian Ramos (@aramcap)
Fecha creación: 01/03/2017
Última modificación: 23/03/2020
Versión: 1.00
***********************************/

var intervalo; //Intervalo de tiempo
var velocidad; //Velocidad del intervalo pasada en el select
var bombo = []; //Array del Bombo donde van a ir las bolas
var hanSalido = []; //Números que ya han salido del bombo

/**
* Devuelve numeros aleatorios de un intervalo
* @param {integer} inicio numero de incio
* @param {integer} fin fin del intervalo
* @param {integer} numero cantidad de numeros aleatorios a generar
* @returns {integer} array de numeros aleatorios
*/
function aleatorio(inicio, fin, numero) {
    var numeros = [];
    var i = 0;
    if (!numero || numero <= 0) {
        return Math.floor(Math.random() * (fin - inicio + 1)) + inicio;
    }
    else {
        while (numeros.length < numero) {
            var aleatorios = Math.floor(Math.random() * (fin - inicio + 1)) + inicio;
            if (numeros.indexOf(aleatorios) == -1) {
                numeros.push(aleatorios);
            }
        }
        return numeros.sort(function (a, b) { return a - b; }); //Ordeno los numeros aleatorios que me han dado como resultados
    }
}

/**
 * Inicia el Bingo y todas las funciones relacionadas
 */
function comenzar() {

    //Establecemos la velocidad
    setVelocidad(window.parent.document.getElementById("velo").value);

    //Relleno array bombo con los numeros
    llenarBombo();

    //Muestro el div de la bola y la lista de bolas.
    muestraBola();

    //Oculto el div de información
    $("#info").css("display", "none");

    //Deshabilito el selector de velocidad, el botón de comenzar y cambio el texto del botón
    document.getElementById("velo").disabled = true;
    document.getElementById("biniciar").disabled = true;
    document.getElementById("biniciar").innerHTML = "REANUDAR";
    document.getElementById("bresetear").disabled = false;

    iniciar();
}

/**
 * Inicia intervalo que muestra las bolas según la velocidad establecida.
 */
function iniciar() {
    intervalo = setInterval(seleccionaBola, velocidad);
    document.getElementById("bpausa").disabled = false;
}

/**
 * Pausa el juego y cambia los botones activos
 */
function pausar() {
    parar();
    document.getElementById("biniciar").disabled = false;
    document.getElementById("biniciar").setAttribute("onClick", "reanudar()");
    document.getElementById("bpausa").disabled = true;
    document.getElementById("velo").disabled = false;
}

/**
 * Reanuda el juego y cambia los botones activos
 */
function reanudar() {
    setVelocidad(window.parent.document.getElementById("velo").value);
    iniciar();
    document.getElementById("biniciar").disabled = true;
    document.getElementById("bpausa").disabled = false;
    document.getElementById("velo").disabled = true;
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
function resetear() {
    window.location.reload();
}

/**
 * Establece velocidad
 */
function setVelocidad(int){
    velocidad = int * 1000;
}

/**
 * Literalmente llena el bombo/array con los numeros de las bolas
 */
function llenarBombo() {
    for (i = 1; i <= 90; i++) {
        bombo.push(i);
    }
}

/**
 * Selecciona la bola de forma aleatoria
 */
function seleccionaBola() {
    nbolas = bombo.length;
    bola = Math.floor(Math.random() * nbolas);
    sacaBola(bola);
}

/**
 * Saca la bola y anotamos el valor extraido
 */
function sacaBola(indice) {
    nbola = bombo[indice];
    //Guardo en un array los números que han salido
    hanSalido.push(nbola);

    if (hanSalido.length <= 90) {
        //Quito la bola del array
        bombo.splice(indice, 1);
        document.getElementById("bola").innerHTML = nbola;
        document.getElementById("lista_bolas").innerHTML = "<div id='bolita'>".concat(hanSalido.join("</div><div id='bolita'>"),"</div>")
        document.getElementById("ordenar_button").innerHTML = "ORDEN NUMÉRICO";
        document.getElementById("ordenar_button").setAttribute("href", "javascript:ordenar()");
    }else {
        alert("Se han sacado todos los números");
        parar();
    }
}

/**
 * Genera el div donde se mostrará la bola
 */
function muestraBola() {
    $("#derecho").append("<br>");
    $("#derecho").append("<div id='bola'>?</div>");
    $("#derecho").append("<br><br>");
    $("#derecho").append("<p>BOLAS EXTRAÍDAS (ver por <a id='ordenar_button' href='javascript:ordenar()'>ORDEN NUMÉRICO</a>)</p>");
    $("#derecho").append("<div id='lista_bolas'></div>");
}

function ordenar(){
    $("#lista_bolas").empty();
    lista_bolas = [...hanSalido]
    lista_bolas.sort(function(a, b){return a - b;});
    document.getElementById("lista_bolas").innerHTML = "<div id='bolita'>".concat(lista_bolas.join("</div><div id='bolita'>"),"</div>");
    document.getElementById("ordenar_button").innerHTML = "ORDEN DE EXTRACCIÓN";
    document.getElementById("ordenar_button").setAttribute("href", "javascript:desordenar()");
}

function desordenar(){
    $("#lista_bolas").empty();
    document.getElementById("lista_bolas").innerHTML = "<div id='bolita'>".concat(hanSalido.join("</div><div id='bolita'>"),"</div>");
    document.getElementById("ordenar_button").innerHTML = "ORDEN NUMÉRICO";
    document.getElementById("ordenar_button").setAttribute("href", "javascript:ordenar()");
}