
document.addEventListener('DOMContentLoaded', cargarNav);

"use strict";

function cargarNav () {

    document.querySelector("#btn-menu").addEventListener("click", function () {

            document.querySelector("nav").classList.toggle("desplegarNav");
    })

}
