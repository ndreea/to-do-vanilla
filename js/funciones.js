
//Traemos los elementos el HTML
const formulario = document.querySelector("form");
const inputText = document.querySelector('form input[type="text"]');
const contenedorTareas = document.querySelector(".tareas");


//Carga inicial de los datos (conexión con el Front-End)
fetch("https://api-to-do-q6qp.onrender.com/tareas")
.then(respuesta => respuesta.json())
.then(tareas =>{
    
   tareas.forEach(({id,tarea,estado}) => {
    new Tarea(id,tarea,estado,contenedorTareas);
   });

})


//Al escribir en el input del formulario.
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    //Creamos la tarea en el Front: //Las tareas que creemos ahora también se crearán en la base de datos:
    if(inputText.value.trim() != ""){

        let tarea = inputText.value.trim(); //Creamos una variable de lo que ha escrito el usuario en el input
        
        //Creamos una nueva tarea
        fetch("https://api-to-do-q6qp.onrender.com/tareas/nueva",{
            method : "POST",
            body : JSON.stringify({tarea}),
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(({id,error}) => { //El error, es un error informativo del servidor
            if(!error){
                new Tarea(id,tarea,false,contenedorTareas); //El false es el estado por defecto que se ha creado en la base de datos
                return inputText.value = "";
            }
            console.log("error en la ejecución");
        })
    }
});


