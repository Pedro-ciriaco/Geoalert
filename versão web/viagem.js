let historicoViagens = JSON.parse(
    localStorage.getItem("historicoViagens")
) || [];

const alarme = new Audio("assets/sounds/som_alarme.wav");

let alertaAtivado = false;

const mapa = L.map('map');

/* DESTINO SALVO */

let destinoLat =
parseFloat(localStorage.getItem("destinoLat"));

let destinoLong =
parseFloat(localStorage.getItem("destinoLong"));

/* RAIO SALVO */

const raio =
parseFloat(localStorage.getItem("raio")) * 1000;

/* USUÁRIO */

let usuarioLat = null;
let usuarioLong = null;

/* MARCADORES */

let marcadorUsuario;
let marcadorDestino;

/* CONTROLE */

let primeiraLocalizacao = true;

/* GPS */

navigator.geolocation.watchPosition((posicao)=>{

    const latitudeUsuario =
    posicao.coords.latitude;

    const longitudeUsuario =
    posicao.coords.longitude;

    usuarioLat = latitudeUsuario;
    usuarioLong = longitudeUsuario;

    /* CENTRALIZA APENAS UMA VEZ */

    if(primeiraLocalizacao){

        mapa.setView(
            [latitudeUsuario, longitudeUsuario],
            15
        );

        primeiraLocalizacao = false;

    }

    /* REMOVE MARCADOR ANTIGO */

    if(marcadorUsuario){

        mapa.removeLayer(marcadorUsuario);

    }

    /* MARCADOR USUÁRIO */

    marcadorUsuario = L.marker([
        latitudeUsuario,
        longitudeUsuario
    ])
    .addTo(mapa)
    .bindPopup("Você está aqui");

    /* CÁLCULO DISTÂNCIA */

    if(destinoLat !== null &&
       destinoLong !== null){

        const distancia = calcularDistancia(

            latitudeUsuario,
            longitudeUsuario,

            destinoLat,
            destinoLong

        );

        console.log(
            distancia.toFixed(2)
        );

        document.getElementById(
            "distancia"
        ).innerText = distancia.toFixed(0);

        /* ALERTA */

        if(distancia <= raio &&
           !alertaAtivado){

            alertaAtivado = true;

            document.body.classList.add(
                "alerta"
            );

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

L.tileLayer(

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

{
    attribution:
    '&copy; OpenStreetMap contributors'
}

).addTo(mapa);

/* MOSTRAR DESTINO */

if(destinoLat && destinoLong){

    marcadorDestino = L.marker([

        destinoLat,
        destinoLong

    ])
    .addTo(mapa)
    .bindPopup("Destino")
    .openPopup();

}

/* ENCERRAR */

document.querySelector(".encerrar")
.addEventListener("click", ()=>{

    alarme.pause();

    alarme.currentTime = 0;

    const viagem = {

    destino: `${destinoLat}, ${destinoLong}`,

    distanciaFinal:
    document.getElementById("distancia")
    .innerText,

    data:
    new Date().toLocaleString()

};

historicoViagens.push(viagem);

localStorage.setItem(
    "historicoViagens",
    JSON.stringify(historicoViagens)
);

    window.location.href =
    "geoalert.html";

});

/* MUDAR ROTA */

document.querySelector(".rota")
.addEventListener("click", ()=>{

    window.location.href =
    "geoalert.html";

});

/* DISTÂNCIA */

function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
){

    const raioTerra = 6371e3;

    const phi1 =
    lat1 * Math.PI / 180;

    const phi2 =
    lat2 * Math.PI / 180;

    const deltaPhi =
    (lat2-lat1) * Math.PI / 180;

    const deltaLambda =
    (lon2-lon1) * Math.PI / 180;

    const a =

        Math.sin(deltaPhi/2) *
        Math.sin(deltaPhi/2) +

        Math.cos(phi1) *
        Math.cos(phi2) *

        Math.sin(deltaLambda/2) *
        Math.sin(deltaLambda/2);

    const c =

        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1-a)
        );

    return raioTerra * c;

}

console.log(

JSON.parse(
localStorage.getItem("historicoViagens")
)

);