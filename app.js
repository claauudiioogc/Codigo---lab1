const express = require('express')
const app = express()

let {cities} = require('./data')
app.use(express.json()) //requirido

app.get('/', (req, res) => {
    res
        .send(//Codigo HTML de la pagina principal
        '<html><title>LABORATORIO 1</title><body><h1> Ciudades Peruanas </h1><a href= "/api/cities">Ciudades</a></body></html>'
        )
})

app.get('/api/cities', (req, res) => {
    res
        .status(200)    //OK
        .json({ success: true, data: cities})    //Imprime los datos de data.js
})

app.get('/api/cities/:cityID', (req, res) => {
    console.log(req.params)
    const {cityID} = req.params
    const city = cities.find(
        city => city.id === Number(cityID)
    )
    if(!city) {
        return res
            .status(404)
            .send('Ciudad no encontrada')
    }
    res.json(city)
})

app.post('/api/cities', (req, res) => {
    const {id, name, hab} = req.body    //A cada variable se le asigna el valor correspondiente del request

    if(!name || !id || !hab){      //Se ejecuta si lo ingresado no es un nombre (¿string?)
        return res
            .status(400)    //Bad request
            .json({ succes: false, msg: 'Proveer un id, el nombre de la ciudad y el número de habitantes'})  //El proceso no se logro ejecutar y envia un mensaje
    }
    else
    if(typeof id !== "number" || typeof hab !== "number"){  //Si se ingresa una palabra en id o hab
        res
            .send({succes: false, msg: 'Ingrese solo cantidades numericas para id y hab'})  //El proceso no se logro ejecutar y envia un mensaje
    }
    res
        .status(201)    //Created
        .send( {succes: true, data: [...cities, {id, name, hab}] })    //El proceso fue un exito y agrega una nueva ciudad
})

app.put('/api/cities/:id', (req, res) => {
    const {id} = req.params     //id = :id
    const {name, hab} = req.body    //Se asigna el valor que se está ingresando
    const city = cities.find(
        (city) => city.id === Number(id)    //Busca el id dentro de data.js
    )
    if(!city){      //Se ejecuta si no encuentra alguna ciudad con ese id
        return res
            .status(400)    //Bad request
            .json({ succes: false, msg: `La Ciudad no posee id ${id}`}) //El proceso no se logro ejecutar y envia un mensaje
    }
    const newCity = cities.map(city => {
        if (city.id === Number(id)) {
            city.name = name
            city.hab = hab
        }
        return city
    })
    res
        .status(201)    //Created
        .send( {succes: true, data: newCity})
})

app.delete('/api/cities/:id', (req, res) => {
    const {id} = req.params
    const city = cities.find(
        (city) => city.id === Number(id)
    )
    if(!city){
        return res
            .status(400)
            .json({succes: false, msg: `La Ciudad no posee id ${id}`})
    }
    const newCity = cities.filter(
        city => city.id !== Number(id)
    )
    return res
        .status(201)    //Created
        .send({succes: true, data: newCity})
})

app.all('*', (req, res) => {
    res
        .status(404)
        .send('<h1>NO ENCONTRADO</h1>')      //Pagina por defecto cuando no se encuentra la direccion url
})

app.listen(5000, () => {
    console.log('Servidor está en 5000');
})