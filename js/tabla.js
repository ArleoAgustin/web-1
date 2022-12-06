document.addEventListener('DOMContentLoaded', cargarPagina);

"use strict"

function cargarPagina () {
   
    let compra = []
    let arregloID = [];
    let total = 0;

    cargarTabla_desde_api()           // AL CARGAR LA PAGINA APARECEN LOS ELEMENTOS PRECARGADOS
 
    
 // DATOS PRECARGADOS EN LA TABLA SACADOS DEL SERVIDOR


    function cargarTabla_desde_api() { 

            fetch("https://web-unicen.herokuapp.com/api/groups/103FerminMedinaAgustinArleo/viandas",{

                "method": "GET",
                "mode": "cors"

            })
            .then(function(r){
                
                if (!r.ok) {
                    console.log("error")
                }
                return r.json()

            })
            
            .then(function (json){

                for (let i = 0; i < json.viandas.length; i++) { // CON ESTE FOR SE AHORRA REPETIR CODIGO PARA CARGAR LOS OBJETOS DEL SERVIDOR
                    let checkBox = document.getElementById('btn-celiacos');
                    
                    let carrito = json.viandas[i];              //ES EL OBJETO, SOLO EL PRODUCTO Y EL PRECIO
                    total += json.viandas[i].thing.precio;      //EL TOTAL SE VUELVE, EL TOTAL + EL PRECIO
                    compra.push(carrito.thing);                 //SE CARGA EL JSON AL ARREGLO
                    arregloID.push(json.viandas[i]._id);        //SE CARGAN LAS ID'S AL ARREGLO
                    let nro_id = json.viandas[i]._id            //SE OBTIENE LA ID DEL OBJETO
                    crear_tabla (carrito, nro_id,checkBox);        //SE PASAN COMO PARAMETROS EL JSON COMPLETO, EL CARRITO CON PRODUCTO Y PRECIO, Y EL ID
                
                }
           
            })

            .catch (function(e) {

                console.log(e)
    
            })

            console.log("Arreglo Compra:");
            console.log(compra);
            console.log("Arreglo de id's:");
            console.log(arregloID);
            
    }


 //BOTON AGREGAR 1
    

    document.getElementById("agregar").addEventListener("click", function() {
        
        let producto = document.getElementById('producto').value;
        let precio = parseInt (document.getElementById('precio').value);
        let checkBox = document.getElementById('btn-celiacos');
        let carrito;
        
        if ((producto != '') && (precio != '')) {

            carrito = cargarObjeto(producto, precio, checkBox);     // LA VARIABLE CARRITO SE VUELVE LO QUE RETORNA "cargarObjeto()"                   
            cargar_datos_a_la_API (carrito)               //SE SUBE AL SERVIDOR
        }

        console.log("Arreglo Compra:")
        console.log(compra)
        console.log("Arreglo de id's:")
        console.log(arregloID)
    })
 
    
 // BOTON AGREGAR X3
    

    document.getElementById("agregar3").addEventListener("click", function() {

        let cont = compra.length                                  //CONT SE VUELVE LA LONGUITUD DEL ARREGLO
        let max = cont +3;                                        // MAX SE VUELVE CONT + 3 PORQUE DESDE LA ULTIMA POSICION DEL ARREGLO SE CREAN 3 NUEVAS CELDAS
        let producto = document.getElementById('producto').value;
        let precio = parseInt (document.getElementById('precio').value);
        let checkBox = document.getElementById('btn-celiacos');
        let carrito;
        

        while ((cont < max) && ((producto != '') && (precio != ''))) {  // EL WHILE FUNCIONA COMO EL FOR, CICLA 3 VECES
            
            carrito = cargarObjeto(producto, precio,checkBox);          // LA VARIABLE CARRITO SE VUELVE LO QUE RETORNA "cargarObjeto()"
            cargar_datos_a_la_API(carrito);                             //SE SUBE AL SERVIDOR
            cont = cont + 1;

        }
        
    })


 //BORRAR TODOS LOS ELEMEMTOS DE LA TABLA 
    

    document.getElementById("vaciarTabla").addEventListener('click', function(){
        
        eliminar_toda_la_API ();                            //SE BORRAN LOS OBJETOS DEL SERVIDOR, EXCEPTO LOS PRECARGADOS
        document.getElementById("carrito").innerHTML = '';  //SE BORRA EL HTML DE LAS FILAS
        compra = [];                                        //SE VACIA EL ARREGLO
        arregloID = [];                                     //SE VACIA EL ARREGLO 
        total = 0;                                          //SE REINICIA EL TOTAL DESDE CERO
       
        console.log("Arreglo de compra:");
        console.log(compra);
        console.log();
        console.log("Arreglo de ID's:");
        console.log(arregloID);

    })
    
 
 // FUNCION PARA CARGAR EL PRODUCTO Y EL PRECIO A UN OBJETO, RETORNA EL JSON "CARRITO"


    function cargarObjeto(producto, precio, checkBox) {
        
        let celiacos;

        if (checkBox.checked == true){  //ESTO NOS AYUDA A SABER SI LA VIANDA ES PARA CELIACOS O NO
            celiacos = "si";
        }
        else{
            celiacos = "no"
        }

        let carrito = {         //OBJETO QUE CONTIENE EL ARTICULO CON SU PRECIO Y EL PRECIO TOTAL HASTA EL MOMENTO
            
            "thing": {

                "producto": producto,
                "precio" : precio,
                "celiacos": celiacos
            },
        }    

        return(carrito);

    }


 //SUBIR DATOS AL SERVIDOR


    function cargar_datos_a_la_API (carrito) { 

        fetch('https://web-unicen.herokuapp.com/api/groups/103FerminMedinaAgustinArleo/viandas', { 
            
            "method": "POST",
            "mode": "cors",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(carrito)
            
        })
        
        .then(function(r){

            if (!r.ok){
                console.log("ERROR!")
            }
            return r.json()

        })

        .then (function(json) {

            console.log("Carga exitosa!")
            compra.push(carrito.thing);                 //SE CARGAN LOS JSON AL ARREGLO
            arregloID.push(json.information._id);       //SE AGREGAN LOS IDS AL ARREGLO DE ID
            total += carrito.thing.precio;              //EL TOTAL SE VUELVE EL TOTAL + EL PRECIO DEL JSON
            let nro_id = json.information._id           //OBTENGO EL ID DEL OBJETO Y LO PASO AL CREAR TABLA
            crear_tabla (carrito, nro_id)              /*EL CARRITO ES EL OBJETO CON PRODUCTO 
                                                        Y PRECIO SOLO (PARA CREAR LA FILA MAS FACIL) Y EL NRO_ID ES PARA PONERSELO A CADA FILA */
        })
        
        .catch(function(e){
            console.log(e);
        })
    }


 //FUNCION QUE CREA UNA NUEVA FILA EN LA TABLA A PARTIR DE DATOS OBTENIDOS DE EL SERVIDOR


    function crear_tabla (carrito, nro_id) {

            let nuevoID = nro_id;     //SE LE ASIGNA EL ID DEL OBJETO   
            let filaTabla = document.getElementById("carrito");

            if (carrito.thing.celiacos == "si"){        //SI ES PARA CELIACOS O NO
                filaTabla.innerHTML +=  '<tr id='+nuevoID+'><td>' + carrito.thing.producto +'</td><td>' + "$ " + carrito.thing.precio + '</td><td>' + "$ " + total + '</td><td class="botonBorrar"> <button class="botonBorrarTD" id="' + nuevoID+ '"> <i class="fa fa-trash-o"></i></button> <button class="botonEditarTD" id="' + nuevoID+ '"><i class="fa fa-edit"></i></button></td></tr>';
            }
            
            else{
               filaTabla.innerHTML +=  '<tr id='+nuevoID+' class="paraNOceliacos"><td>' + carrito.thing.producto +'</td><td>' + "$ " + carrito.thing.precio + '</td><td>' + "$ " + total + '</td><td class="botonBorrar"> <button class="botonBorrarTD" id="' + nuevoID+ '"> <i class="fa fa-trash-o"></i></button> <button class="botonEditarTD" id="' + nuevoID+ '"><i class="fa fa-edit"></i></button></td></tr>';
            }

            boton_editar_fila();  
            boton_borrar_fila();
           
    }


 //FUNCION QUE ELIMINA TODAS LOS JSNON DE LA API EXCEPTO LOS PRECARGADOS


    function eliminar_toda_la_API () {

        fetch("https://web-unicen.herokuapp.com/api/groups/103FerminMedinaAgustinArleo/viandas",{

        })
        
        .then(function(r){

            if (!r.ok) {
                console.log("error")
            }
            return r.json()

        })
        
        .then(function (json) {

            let nuevoID;

            for (let i = 2; i <= (json.viandas.length); i++) {  //INICIA DESDE 2 PARA NO ELIMINAR LOS PRECARGADOS
                
                nuevoID = json.viandas[i]._id;                 

                fetch('https://web-unicen.herokuapp.com/api/groups/103FerminMedinaAgustinArleo/viandas/'+ nuevoID, {
                
                    'method': 'DELETE',
                    'mode': "cors"

                })
                
                .then(function(r){

                    return r.json()

                })
                
                .then(function(json){
                    
                    console.log("Borrado exitoso!");
                    location.reload();      //HACEMOS QUE REINICIE PARA LLEVAR EL CONTROL DEL PRECIO TOTAL
                    
                })
                
                .catch(function(e){

                    console.log(e)

                })
            }

        })

        .catch (function(e) {

            console.log(e)

        })

    }


 //FUNCION DEL BOTON EDITAR FILAS


    function boton_editar_fila(){
                    
        fetch('https://web-unicen.herokuapp.com/api/groups/103FerminMedinaAgustinArleo/viandas/', {

        })
        
        .then(function(r){

            return r.json()

        })
        
        .then(function(json){
            
            let buttons = document.getElementsByClassName('botonEditarTD'); //SE OBTINEN TODOS LOS BOTONES

            for(let i = 0; i<buttons.length; i++) {       //SE RECORREN TODOS LOS BOTONES
    
                buttons[i].addEventListener('click', () => {        //AL HACER CLICK EN UNO...

                    console.log("este funciono! tocaste el boton: " + i);
                    let carro = document.getElementById('carrito');
                    let child = carro.childNodes[i + 1];  //CHILDNODES ES COMO EL "HIJO", ES DECIR LOS TR. ENTONCES DEPENDE EL BOTON QUE SE TOCO, EDITA ESE EN ESPECIFICO
                    
                    child.innerHTML = '<td><a class="textoInput2"> Vianda: <input type="text" id="productoNuevo"> </a></td><td><a class="textoInput2"> Precio: <input type="number" id="precioNuevo"> </a></td><td><a class="textoInput2"><div class="filtro"><input type="checkbox" id="btn-celiacos2"><label for="btn-celiacos2" class="celiacos">Para celiacos</label></div></a></td><td class="botonBorrar"> <button class="botonBorrarTD" id="' + json.viandas[i]._id + '"> <i class="fa fa-trash-o"></i></button><button type="button" id="edicionTerminada">Edicion terminada!</button></td>';
                    boton_borrar_fila();
                    
                    document.getElementById("edicionTerminada").addEventListener("click", function(){ //CUANDO EL USUARIO HACE CLICK EN "EDICION TERMINADA"...
                        
                        let producto = document.getElementById('productoNuevo').value;
                        let precio = parseInt (document.getElementById('precioNuevo').value);
                        let checkBox = document.getElementById('btn-celiacos2');            //OPCION PARA MARCAR VIANDA CELIACA O NO
                        total += precio;
                        
                        let nuevoCarrito = cargarObjeto(producto, precio, checkBox)

                        if ((producto != '') && (precio != '')) {
                            
                            let idProducto = carro.childNodes[i+1].childNodes[3].childNodes[1].id; //SE ACCEDE AL ID DEL BOTON DE LA FILA QUE SE EDITO
                            editarTablaServidor(nuevoCarrito, idProducto,child,i);      //SE EDITAN LOS DATOS EN EL SERVIDOR
                        }

                        else{
                            alert("Complete los casilleros.");  //SI ESTAN VACIOS LOS INPUTS SALTA ESTE ALERT
                        }
                    })
            
                })
            }
        
        })
        
        .catch (function(e) {
            console.log(e)
        });
        
    }


 //FUNCION QUE EDITA EL JSON EN LA API


    function editarTablaServidor(nuevoCarrito, idFila){
        
        fetch('https://web-unicen.herokuapp.com/api/groups/103FerminMedinaAgustinArleo/viandas/' + idFila, { //SE LE PASA EL ID DEL JSON A EDITAR

            'method': 'PUT',                        
            "mode": 'cors',                                                                         
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify(nuevoCarrito)
            
        })
        
        .then(function(r){

            if (!r.ok){
                console.log("ERROR!")
            }
            return r.json();

        })
        
        .then(function(json){

            
            location.reload();   //RECARGAMOS PARA MANTENER EL TOTAL ACTUALIZADO

        })
        
        .catch(function(e){
            console.log(e);
        })

    }


 //FUNCION DE BOTON BORRAR FILA
    

    function boton_borrar_fila () { 

    let filas = document.querySelectorAll('tr');            //SE OBTIENEN TODOS LOS TR 
    let buttons = document.getElementsByClassName('botonBorrarTD');     //SE OBTIENEN TODOS LOS BOTONES

        for (let i = 0; i < buttons.length; i++) {  //SE RECORREN TODOS LOS BOTONES
           
            buttons[i].addEventListener('click', function() {   //AL HACER CLICK EN UN BOTON...
               
                console.log("Fila eliminada: " + filas[i+1].id);    
                borrarFila_en_servidor(filas[i+1].id);      //SE BORRA EL JSON EN EL SERVIDOR
                filas[i+1].remove() //ELIMINAMOS LA FILA DEL HTML
            })
            
        }
    }
 

 //FUNCION QUE BORRA EN LA API EL JSON DE LA FILA QUE SE BORRO


    function borrarFila_en_servidor(idFila) {

        fetch('https://web-unicen.herokuapp.com/api/groups/103FerminMedinaAgustinArleo/viandas/'+ idFila, { 
            
            'method': 'DELETE',
            'mode': "cors"

        })
        
        .then(function(r){

            if (!r.ok) {
                console.log("error")
            }
            return r.json()

        })
        
        .then(function(json){   
            
            console.log("Borrado exitoso!");
            location.reload();
        
        })

        .catch (function(e) {

            console.log(e)

        })
    }
            


 //BOTON FILTRO
 
    document.querySelector("#btn-filtro").addEventListener("click", function () {

        let filaNOceliacos = document.getElementsByClassName('paraNOceliacos'); //SE OBTIENEN LAS FILAS "PARA NO CELIACOS"
                
        for(let i = 0; i < filaNOceliacos.length; i++){ //SE RRECORREN ESAS FILAS
            
            filaNOceliacos[i].classList.toggle("desaparecer");  //SE OCULTAN LAS FILAS DE LAS VIANDAS QUE NO SON CELIACAS

            console.log("Se estan mostrando los alimentos para celiacos!")
        }

    })

    

}