"use strict"

document.addEventListener('DOMContentLoaded', cargarPagina);

function cargarPagina () {

    // Generar numeros para captcha

    let valor1 = Math.floor(Math.random() * 100);
    let valor2 = Math.floor(Math.random() * 10);
    let texto = document.querySelector("#textocaptcha").innerHTML = "Introduzca el resultado " + valor1 + " + " + valor2 + " = ";
    let suma = valor1 + valor2;

    // Funcion que verifica el captcha y envia el formulario

    function enviarformulario() {

        let inputnombre = document.querySelector("#nombre");
        let nombre = inputnombre.value;

        let inputapellido = document.querySelector("#apellido");
        let apellido = inputapellido.value;

        let inputcorreo = document.querySelector("#correo");
        let correo = inputcorreo.value;

        let inputconsulta = document.querySelector("#consulta");
        let consulta = inputconsulta.value;

        let inputCaptcha = document.querySelector("#respuestaCaptcha");
        let valor = inputCaptcha.value;

    // Si el usuario no ingresa su correo va a aparecer el mensaje de INCORRECTO.

        if (correo == ""){
            document.querySelector("#avisoCaptcha").innerHTML = "Porfavor " + nombre + ", ingrese correctamente su direccion de correo electronico.";
            document.querySelector("#avisoCaptcha").classList.add("mensajeIncorrecto");
        }

    // Si el usuario no ingresa su consulta va a aparecer el mensaje de INCORRECTO.

        else if (consulta == "") {
            document.querySelector("#avisoCaptcha").innerHTML = "Porfavor " + nombre + ", ingrese su consulta.";
            document.querySelector("#avisoCaptcha").classList.add("mensajeIncorrecto");
        }

    // Si el usuario ingresa BIEN el captcha y ademas ingresa el correo y la consulta, va a aparecer el mensaje de captcha CORRECTO.

        else if ((valor == suma)) {

            document.querySelector("#avisoCaptcha").innerHTML = "Gracias " + nombre + " , su consulta a sido enviada desde tu mail " + correo + " y sera respondida lo antes posible! ❤";
            document.querySelector("#avisoCaptcha").classList.add("mensajeCorrecto");
        }
        
    // Si el usuario ingresa el correo y la consulta, pero ingresa MAL el captcha va a aparecer el mensaje de captcha INCORRECTO.

        else if (valor !== suma) {

            document.querySelector("#avisoCaptcha").innerHTML = "Respuesta incorrecta. Por favor " + nombre + " ingrese el resultado correctamente.";
            document.querySelector("#avisoCaptcha").classList.add("mensajeIncorrecto");
        }


    // Si no hay valor ingresado en el captcha, entonces se pedira realizarlo.
    
        if (valor == "") {
            document.querySelector("#avisoCaptcha").innerHTML = "Realice el captcha correctamente.";
        }

    }


    //Boton enviar

    let boton = document.querySelector("#botonEnviar").addEventListener("click", enviarformulario);

}