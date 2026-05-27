const alarme = new Audio("assets/sounds/som_alarme.wav");

let alertaAtivado = false;

const mapa = L.map('map');

let destinoLat = null;
let destinoLong = null;

let usuarioLat = null;
let usuarioLong = null;

let marcadorUsuario;
let marcadorDestino;

let primeiraLocalizacao = true;

/* GPS */

navigator.geolocation.watchPosition((posicao)=>{

    const latitudeUsuario = posicao.coords.latitude;
    const longitudeUsuario = posicao.coords.longitude;

    usuarioLat = latitudeUsuario;
    usuarioLong = longitudeUsuario;

    if(primeiraLocalizacao){

        mapa.setView([latitudeUsuario, longitudeUsuario], 15);

        primeiraLocalizacao = false;

    }

    if(marcadorUsuario){

        mapa.removeLayer(marcadorUsuario);

    }

    marcadorUsuario = L.marker([latitudeUsuario, longitudeUsuario])
    .addTo(mapa)
    .bindPopup("Você está aqui");

    if(destinoLat !== null && destinoLong !== null){

        const distancia = calcularDistancia(
            latitudeUsuario,
            longitudeUsuario,
            destinoLat,
            destinoLong
        );

        console.log(distancia.toFixed(2));

        document.getElementById("distancia").innerText =
        distancia.toFixed(0);

        const raio = 500;

        if(distancia <= raio && !alertaAtivado){

            alertaAtivado = true;

            document.body.classList.add("alerta");

            alarme.play();

            navigator.vibrate(1000);

        }

    }

},
(error)=>{
    console.log(error);
},
{
    enableHighAccuracy: true
});

/* MAPA */

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

    attribution: '&copy; OpenStreetMap contributors'

}).addTo(mapa);

/* ESCOLHER DESTINO */

mapa.on('click', function(e){

    const latitudeDestino = e.latlng.lat;
    const longitudeDestino = e.latlng.lng;

    destinoLat = latitudeDestino;
    destinoLong = longitudeDestino;

    alertaAtivado = false;

    document.body.classList.remove("alerta");

    if(marcadorDestino){

        mapa.removeLayer(marcadorDestino);

    }

    marcadorDestino = L.marker([latitudeDestino, longitudeDestino])
    .addTo(mapa)
    .bindPopup("Destino selecionado")
    .openPopup();

});

/* ENCERRAR */

document.querySelector(".encerrar")
.addEventListener("click", ()=>{

    alarme.pause();

    alarme.currentTime = 0;

    document.body.classList.remove("alerta");

});

/* MUDAR ROTA */

document.querySelector(".rota")
.addEventListener("click", ()=>{

    alert("Clique no mapa para selecionar um novo destino.");

});

/* DISTÂNCIA */

function calcularDistancia(lat1, lon1, lat2, lon2){

    const raioTerra = 6371e3;

    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;

    const deltaPhi = (lat2-lat1) * Math.PI / 180;
    const deltaLambda = (lon2-lon1) * Math.PI / 180;

    const a =

        Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +

        Math.cos(phi1) * Math.cos(phi2) *

        Math.sin(deltaLambda/2) *
        Math.sin(deltaLambda/2);

    const c =
        2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return raioTerra * c;

}