const cheerio = require("cheerio");
const mongoose = require("mongoose");
const axios = require("axios");
const express = require("express");
const { response } = require("express");
const exphbs = require('express-handlebars');
require('dotenv').config({path:'./.env'});

const port = process.env.PORT;

const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("EquiposDB").collection("devices");
  console.log(err);
  client.close();
});

const Equipo = require("./Equipo");

mongoose.connect(process.env.URI);

run()
async function run() {
    try {
        var url = 'https://www.futbolargentino.com/primera-division/tabla-de-posiciones';

        axios(url)
            .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('#p_score_contenido_TorneoTabs_collapse3 > div > table > tbody', html).find('tr').each(async function(i){

                var nombreE = $(this).find('span.d-none.d-md-inline').text();
                var posicionE = $(this).find('td:nth-child(1)').text()
                var pjE = $(this).find('td:nth-child(3)').text()
                var gE = $(this).find('td:nth-child(4)').text()
                var ppE = $(this).find('td:nth-child(5)').text()
                var peE = $(this).find('td:nth-child(6)').text()
                var gfE = $(this).find('td:nth-child(7)').text()
                var gcE = $(this).find('td:nth-child(8)').text()
                var dfE = $(this).find('td:nth-child(9)').text()
                var ptsE = $(this).find('td:nth-child(10)').text()
                var escudoE = $(this).find('a > img').attr('data-src')
                
                var match = await Equipo.exists({nombre: nombreE})
                var equiposData = {
                         nombre: nombreE,
                        posicion: posicionE,
                        partidosJugados: pjE,
                        partidosGanados: gE,
                        partidosEmpatados: peE,
                        partidosPerdidos: ppE,
                        goles: gfE,
                        golesContra: gcE,
                        diferenciaPuntos: dfE,
                        puntos: ptsE,
                        escudo: escudoE
                }

                if(!match){
                    try {
                    var equipo = new Equipo(equiposData)

                    await equipo.save();
                    }
                    catch(error){
                        console.error(error);
                    }
                }

                else {
                    try{
                    await Equipo.findOneAndUpdate({nombre: nombreE},equiposData);
                    }
                    catch(error){
                        console.error(error);
                    }
                }

            })

        }).catch(err => console.log(err))
    } catch (err) {
        console.log(err)
    }
    
}

setInterval(() => {
    run()
}, process.env.WAIT_TIME || 8000)

const app = express();

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.use(express.static('public'))
app.set('views', __dirname + '/src/views')
app.set('view engine', 'hbs')

app.get("/", async (req, res) => {
    var listaEquipos = await Equipo.find({}).sort({posicion: 1}).lean()
    res.render('index', {listaEquipos})
})

app.listen(port, () => console.log('Server running on port ' + port));