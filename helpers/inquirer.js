const inquirer = require( 'inquirer' );
require( 'colors' )

//este es el menu de navegacion 
const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: [ 
            {
                value: 1,
                name: `${ '1.'.green } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.green } Historial`
            },
            {
                value: 0,
                name: `${ '0.'.green } Salir`
            }, 
    ]
    }
];


// esta funcion es la que toma la respuesta de el usuario y muestra en el menu las opciones de navegacion
const inquirerMenu = async() => {
    console.clear();
    console.log('======================================'.green);
    console.log('       Seleccione una opcion    '.brightYellow);
    console.log('======================================\n'.green);
    
    //Llama a las preguntas y devuelve la respuesta de el usuario
    const { opcion } = await inquirer.prompt( preguntas );

    return opcion;

}

// este es la funcion para hacer la pausa
const pausa = async() => {

    const preguntas = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presione ${ 'ENTER'.green} para continuar`
        }
    ]

    await inquirer.prompt( preguntas )
}


//Y esta funcion es para tomar la respuesta de el usuario y a la vez poner el mensaje que quiera el usuario segun lo que seleccione
const leerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if ( value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true 
            }
        }
    ]

    const { desc } = await inquirer.prompt( question );
    return desc;
}


const listarLugares = async( lugares = [] ) => {
    const choices = lugares.map( ( lugar, i ) => {
        const idx = `${ i + 1 }`;
        return{

            value: lugar.id ,
            name: `${ idx.green }. ${ lugar.nombre }`,
            
        }  
    }

    
    )

    choices.unshift( {
        value: 0,
        name: `${'0'.green}. Cancelar`
    })
 
    const preguntas = [
        {
            type: 'list',
            name:'id',
            message: 'Seleccione su lugar:',
            choices   
    }
]

  const { id } = await inquirer.prompt( preguntas );
  return id;
}

const confirmar = async( message ) => {
    
    const question = [{
        
        type: 'confirm',
        name: 'ok',
        message,
        default: true
        
        
    }
]

  const { ok } = await inquirer.prompt( question );
  return ok;

}

const marcarTareasCompletadas = async( tareas = [] ) => {
    const choices = tareas.map( ( tarea, i ) => {
        const idx = `${ i + 1 }`;
        return{

            value: tarea.id ,
            name: `${ idx.green }. ${ tarea.desc }`,
            checked: ( tarea.completadoEn )
                                        ? true 
                                        : false
            
        }  
    }

    
    )


 
    const preguntas = [
        {
            type: 'checkbox',
            name:'ids',
            message: 'seleccione',
            choices   
    }
]

  const { ids } = await inquirer.prompt( preguntas );
  return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    marcarTareasCompletadas
};