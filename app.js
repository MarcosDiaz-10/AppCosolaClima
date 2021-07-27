require('dotenv').config()


const colors = require ( 'Colors' )
const { inquirerMenu, pausa, leerInput,listarLugares } = require( './helpers/inquirer' );
const Busquedas = require('./models/Busquedas');


const main = async() => {
    
    const busquedas = new Busquedas();


    let opt = '';
    do {

         opt = await inquirerMenu();

         switch( opt ){

            case 1: 
            //Mostrar mensaje
                const preguntaUsuario = await leerInput( 'Ingrese el nombre de la ciudad: ' ); 
            //Buscar los lugares
                const lugares = await busquedas.ciudad( preguntaUsuario )
                const id = await listarLugares( lugares )
             
                if( id === 0) continue;
            
                const lugarSeleccionado = lugares.find( l => l.id === id)

                busquedas.agreagarHistorial( lugarSeleccionado.nombre )
                
                const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng)

                const { temp, min, max, desc} = clima;

                console.clear()
                console.log('\nInformacion de la ciudad\n'.green)
                console.log(`Ciudad: ${ lugarSeleccionado.nombre.green } `)
                console.log(`Lat: ${ colors.yellow(lugarSeleccionado.lat) } `)
                console.log(`Lng: ${ colors.yellow(lugarSeleccionado.lng) }`)
                console.log(`Temperatura: ${ colors.yellow(temp) }`)
                console.log(`Minima: ${ colors.yellow(min) }`)
                console.log(`Maxima: ${ colors.yellow(max) }`)
                console.log(`Como esta el clima: ${desc.yellow }\n`)
            break;
            
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar,i )=> {

                    const idx = `${ i + 1}.`.green;
                    console.log( `${ idx } ${ lugar }`)   
                })
            break;

         }

        if ( opt !== 0 )await pausa()

    } while( opt !== 0 )


}



main()