const { findCities, registerCity, modifyCity, removeCity } = require("../service/cities");
//ESTA CAPA SE PODRIA DENOMINAR COMO LA DE FUNCIONES DE ALTO NIVEL, Y LA
//SERVICE LAS DE BAJO NIVEL, DE COMUNICACIONES CON LA BD
// va a ver una funcion por ruta, es decir se hace primero las routes, despues desde
//aqui se llama a las funciones y en el service esta la logica de todo


const getCities = (async (req, res) => {
    // ESTA FUNCION VA A LLAMAR A OTRA QUE ESTA EN SERVICE,
    //QUE VA A TENER UN METODO POR CADA OPERACION QUE HAYA QUE HACER A MAS BAJO NIVEL
    //DE CAPA
    const cityList = await findCities();

    cityList.forEach((item) => {
        item.foundationDate = item.foundation_date,
        delete item.foundation_date
    });

    res.status(200).json(cityList);
});

const getCity = (async (req, res) => {
    const city = await findCity(req.params.city);

    if (city === undefined) {
        res.status(404).json({
            status: 'not-found',
            message: 'City not found'
        });
        return;
    }

    res.status(200).json({
        //no tengo muy claro porque no pone el objeto entero
        //igual lo que trata de decir es que la respuesta se puede personalizar
        //los campos como lods quiera llamar en l API, yo no me complicaria y pondria
        //com json el objero city
        id: city.id,
        name: city.name,
        population: city.population,
        altitude: city.altitude,
        foundationDate: city.foundation_date,
        age: city.age,
        area: city.area,
        density: city.density
    });
});

const postCity = (async (req, res) => {
    //Aqui realizamos las validaciones
    if (req.body.name === undefined || req.body.name === '') {
        res.status(400).json({
            status: 'bad-request',
            message: 'name field is mandatory'
        });
        return;
    }

    if (req.body.population <= 0) {
        res.status(400).json({
            status: 'bad-request',
            message: 'population must be greater than 0'
        });
        return;
    }
    // TODO Añadir más validaciones (fecha, por ejemplo)
    if (req.body.altitude <= 0) {
        res.status(400).json({
            status: 'bad-request',
            message: 'altitude must be greater than 0'
        });
        return;
    }
    if  (req.body.foundation_date === undefined || req.body.foundation_date === '') {
        res.status(400).json({
            status: 'bad-request',
            message: 'foundation_date is an obliglatory field'
        });
        return;
    }
    if  (req.body.area === undefined || req.body.area === '') {
        res.status(400).json({
            status: 'bad-request',
            message: 'area is an obliglatory field'
        });
        return;
    }


    const result = await registerCity(req.body.name, req.body.population,req.body.altitude,req.body.foundation_date,req.body.area);
    
    //Result solo devuelve los datos que necesito, lo ha hecho la capa service
    //Esto funciona bien
    res.status(201).json({
        id: result.id,
        name: req.body.name,
        population: req.body.population,
        altitude: req.body.altitude,
        foundationDate: req.body.foundation_date,
        age: result.age,
        area: req.body.area,
        density: result.density
    
    });
});

const putCity = (async (req, res) => {
    await modifyCity(req.params.city, req.body.population, req.body.altitude);

    res.status(204).json({});
});

const deleteCity = (async (req, res) => {
    // TODO Validaciones y comprobaciones
    
    await removeCity(req.params.city);
    
    res.status(204).json({})
});

module.exports = {
    getCities,
    getCity,
    postCity,
    putCity,
    deleteCity
};

//las vamos a exportar..., porque..¿quien lo va a necesitar??? ==> el route
