const knex = require('knex');
//aqui es donde necesito el knex y la BD

const { getYearsFromNow } = require('../dateUtils');
const { getDensity } = require('../utils');
// importanmos esta nueva libreria para tener las configuraciones mecanizadas
const { config } = require('../config/configuration');

// Configuración de la base de datos: tipo, ubicación y otros parámetros
//EL SERVICE ES EL UNICO QUE TIENE ACCESO A LA BASE DE DATOS
/*  
Esta seria la configuracion de SQLite, habria que poner su correspondiente
dependencia en package.json====>   "sqlite3": "^5.1.7",
*/
// const db = knex({
//     client: 'sqlite3',
//     connection: {
//         filename: 'cities.db'
//     },
//     useNullAsDefault: true
// });

// esta segunda parte era cuando conectabamos con un contenedor en pruebas con mariaDb

// const db = knex({
//     client: 'mysql',
//     connection: {
//         host: 'localhost',
//         port: 3306,
//         user: 'user',
//         password: 'password',
//         database: 'cities'
//     },
//     useNullAsDefault: true
// });



const db = knex({
    client: 'mysql',
    connection: {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    },
    useNullAsDefault: true
});

// ESTA CAPA YA ES LA DE COMUNICACION CON LA BASE DE DATOS
const findCities = (async () => {
    const result = await db('cities').select('*');

    return result;
});

// aqui ya solo hace falta pasarle los parametros que necesite, si busco
//una ciudad por su nombre, pues solo el nombre de la ciudad
const findCity = (async (name) => {
    const result = await db('cities').select('*').where({name: name}).first();

    return result;
});

// SE PUEDE HACER CUALQUIER COSA, NO TIENE QUE COINCIR CON EL CRUD CLASICO,
//  SI LA API ES PEQUEÑA PUEDE QUE SI COINCIDAN, PERO SI ES GRANDE NO
//Aqui podriamos hacer una funcion para saber si una ciudad existe..
//Creo que esto se podria hacer con el result=== undefined, pero aqui Santi
//lo pone como ejemplo de otras funciones
const cityExists = (async (name) => {

});

//aqui hay que registrar una ciudad, ¿que tengo que pasar?, pues casi todos los datos
//salvo los que calcule, que me los habra pasado el controler
const registerCity = (async (name, population, altitude, foundationDate, area) => {
    const age = getYearsFromNow(new Date(foundationDate));
    const density = getDensity(population, area);

    const returning = await db('cities').insert({
        name: name,
        population: population,
        altitude: altitude,
        foundation_date: foundationDate,
        age: age,
        area: area,
        density: density
    })
    .then(async (ids) => {
        cityId = ids[0];
    });

    const result = {
        id: cityId,
        age: age,
        density: density
    };
    
    return result;
});

const modifyCity = (async (name, population, altitude) => {
    // TODO Modificar el resto de campos
    await db('cities').where({ name: name }).update({
        population: population,
        altitude: altitude
    });
});

const removeCity = (async (name) => {
    await db('cities').del().where({name: name});
});

module.exports = {
    findCities,
    findCity,
    registerCity,
    modifyCity,
    removeCity
};

// HAY QUE EEXPORTARLAS PARA QUE LAS PUEDA RECIBIR LA CAPA CONTROLER