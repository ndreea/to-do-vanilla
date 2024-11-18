
//CREAMOS EL HTML CON JS

//Clase para cada una de las tareas
class Tarea{
    constructor(id,texto,estado,contenedor){ //No hay propidad para estado y contenedor
        this.id = id;
        this.texto = texto;
        this.editando = null; //Propiedad de la tarea
        this.DOM = null; //Esta propiedad crea el HTML de la tarea

        //Esta línea de abajo es lo que va a desescadenar todo el crearDom (creamos el DOM)
        this.crearDom(estado,contenedor);
    }
    crearDom(estado,contenedor){  //Vamos a "dibujar" todo el contenido del html

        //CONTENEDOR TAREA
        this.DOM = document.createElement("div"); //Creamos un DIV (contenedor) desde la API del DOM
        this.DOM.classList.add("tarea"); //Creamos la clase tarea al contenedor

        //TEXTO DE LA TAREA
        let textoTarea = document.createElement("h2"); //Crea un h2
        textoTarea.classList.add("visible"); //Le añadimos la clase visible que está en el css
        textoTarea.innerText = this.texto; //Le pedimos que escriba el div.texto

        //EDITOR TEXTO TAREA
        let editor = document.createElement("input"); //Creamos el input
        editor.setAttribute("type", "text"); //Quiero que sea de tipo texto (pone el atributo "type")
        editor.value = this.texto; //Queremos escribir en él

        //BOTÓN EDITAR
        let botonEditar = document.createElement("button"); //Creamos el botón editar
        botonEditar.classList.add("boton"); //Añadimos la clase botón
        botonEditar.innerText = "editar"; //Queremos editar el texto

        //Creamos un addEvent para poder editar el texto de la tarea
        botonEditar.addEventListener("click", () => this.editarTexto());

        //BOTÓN BORRAR
        let botonBorrar = document.createElement("button"); //Creamos el botón borrar
        botonBorrar.classList.add("boton"); //Añadimos la clase botón
        botonBorrar.innerText = "borrar"; //Queremos editar el texto

        //Creamos un addEvent para a la hora de hacer click en el botón de borrar, la tarea se borra de la lista
        botonBorrar.addEventListener("click",() => this.borrarTarea()); 

        //BOTÓN ESTADO
        let botonEstado = document.createElement("button"); //Creamos el botón borrar
        botonEstado.className = `estado ${estado ? "terminada" : ""}`; //Si estado es true quiere decir que está terminada, sino, no se pone nada
        botonEstado.appendChild(document.createElement("span")); //Añadimos un span al botón con la clase estado

        //Creamos un addEvent para el botón toggle, que pase de rojo a verde
        botonEstado.addEventListener("click", () => { 
            this.editarEstado()
            .then (() => botonEstado.classList.toggle("terminada"))
            .catch(() => console.log("mostrar el error al usuario"));
        });


        //AÑADIR ELEMENTOS AL DOM AL DIV EN EL ORDEN QUE LO NECESITAMOS
        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editor);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);

        //Hacemos que funcione
        contenedor.appendChild(this.DOM);
    }

    //Creamos un método para editar el estado (botón toggle)
    editarEstado(){
        return new Promise((ok,ko) => {
            
            fetch(`https://api-to-do-q6qp.onrender.com/tareas/actualizar/${this.id}/2`,{
                method : "PUT"
            })
            .then(respuesta => respuesta.json())
            .then(({resultado,error}) => { //No se pone id,error ya que el id está en el POST

                if(error || resultado == "ko"){ //Si hay error o el resultado es erróneo, se rechaza la promesa. Sino, la cumplo.
                    return ko();
                }
                ok();
            });

        });
    }

    //Creamos un método para editar el texto del input del formulario
    async editarTexto(){
        if(this.editando){ //Revertimos el proceso del else

            let tareaTemporal = this.DOM.children[1].value.trim();

            //Este if es donde se hará la petición fetch para cambiar la base de datos
            if(tareaTemporal != "" && tareaTemporal != this.texto){
                let {resultado,error} = await fetch(`https://api-to-do-q6qp.onrender.com/tareas/actualizar/${this.id}/1`,{
                    method : "PUT",
                    body : JSON.stringify({ tarea : tareaTemporal }),
                    headers : {
                        "Content-type" : "application/json"
                    }
                }).then(respuesta => respuesta.json());

                if(error || resultado == "ko"){
                    console.log(resultado);
                    console.log("error en la ejecución");
                }
                else{
                    this.texto = tareaTemporal;
                }
            }

            this.DOM.children[1].classList.remove("visible"); //Queremos ocultar el input
            this.DOM.children[0].innerText = this.texto; //Queremos poner texto al input
            this.DOM.children[0].classList.add("visible"); //Se la volvemos a poner una vez modificado lo de arriba
            this.DOM.children[2].innerText = "editar"; //Ahora queremos editar los datos
        }
        else{
            this.DOM.children[0].classList.remove("visible"); //Quitamos la clase visible al input
            this.DOM.children[1].value = this.texto; //Modificamos el value del input
            this.DOM.children[1].classList.add("visible"); //Se la volvemos a poner una vez modificado lo de arriba
            this.DOM.children[2].innerText = "guardar"; //Guardamos los datos una vez modificados
        }
        this.editando = !this.editando; //Interruptor, se guarda o no se guarda
    }

    //Creamos un método para borrar la tarea, una vez hemos seleccionado el botón
    borrarTarea(){   
        fetch(`https://api-to-do-q6qp.onrender.com/tareas/borrar/${this.id}`,{
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({resultado,error}) => { //No se pone id,error ya que el id está en el POST

            if(error || resultado == "ko"){ //Si hay error o el resultado es erróneo, se rechaza la promesa. Sino, la cumplo.
                return console.log("error en la ejecución");
            }
            this.DOM.remove();
        });
    }
}