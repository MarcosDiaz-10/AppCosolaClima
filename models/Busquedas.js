const fs = require( 'fs' );
const axios = require( 'axios' );

class Busquedas {

    historial = [];
    dbPath = './db/database.json';
    constructor(){
    
        this.leerDB();
    
    }

    get historialCapitalizado(){
        return this.historial.map( lugar =>{

            let palabras = lugar.split(' ')
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1))
            
            return palabras.join(' ')

        })
    }


    get paramsMapBox (){
        return {

            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'            
        }
    }

    get paramsOpenWeather(){
        return {

            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'

        }
    }



    async ciudad( lugar = "" ){
        //Hacer peticion http
        try{
            
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapBox
            })


            const resp = await instance.get();

            return resp.data.features.map( lugar => ({ 

                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],

            }))

        }catch( err ){
           throw console.log( err )
        }
    }

    async climaLugar( lat, lon ){
        try{
            // intance axios
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ...this.paramsOpenWeather, lat, lon}
            })

            //resp.data 
            const resp = await instance.get()
            //retornar un objeto con la descricion, la temperarura minima, maxima y normal 
            const { weather, main } = resp.data;
            const desc = weather[0].description
            const { temp, temp_min, temp_max } = main;

            return{
                
                 desc,
                 temp,
                min: temp_min,
                max: temp_max

            }
      
        }catch( err ){
            console.log( 'Odio este error ',err )
        }
    }

    agreagarHistorial( lugar = '' ){
        //prevenir buscados
        if( !this.historial.includes( lugar.toLocaleLowerCase() ) ){

                this.historial.unshift( lugar.toLocaleLowerCase() );
                
                this.historial = this.historial.splice(0,5);
        }



        

        this.guardarDB();

    }


    guardarDB(){

        const payload = {

            historial: this.historial

        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload )  )



    }

    leerDB(){

        if( !fs.existsSync( this.dbPath )){
            return null;
        }

        const infoDb = fs.readFileSync( this.dbPath, { encoding: 'utf-8' })
        const dataDb = JSON.parse( infoDb )

        this.historial = dataDb.historial

    }

}




module.exports = Busquedas;