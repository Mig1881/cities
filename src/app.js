const express = require('express');

const cities = require('./route/cities');
//imporo el fichero de rutas
const { config } = require('./config/configuration');
//ojo como app no esta en el raiz no es ../config/configuration solo es ./config/configuration
//importo el fichero de configuracion para parametrizarl el puerto


const app = express();
app.use(express.json());

app.use('/', cities);
//con esto establezco que quiero usar todas las operaciones que haya en la ruta de ciudades
//

app.listen(config.service.port, () => {
    console.log('Iniciando el backend en el puerto ' + config.service.port);
});

module.exports =  { app };
