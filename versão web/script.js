const mapa = L.map('map');

let marcadorUsuario;
let marcadorDestino;

let destinoLat = null;
let destinoLong = null;

let primeiraLocalizacao = true;

/* GPS */

navigator.geolocation.watchPosition((posicao)=>{

    const latitudeUsuario =
    posicao.coords.latitude;

    const longitudeUsuario =
    posicao.coords.longitude;

    if(primeiraLocalizacao){

        mapa.setView(
            [latitudeUsuario, longitudeUsuario],
            15
        );

        primeiraLocalizacao = false;

    }

    if(marcadorUsuario){

        mapa.removeLayer(marcadorUsuario);

    }

    marcadorUsuario = L.marker([
        latitudeUsuario,
        longitudeUsuario
    ])
    .addTo(mapa)
    .bindPopup("Você está aqui");

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
    attribution: '&copy; OpenStreetMap contributors'
})
.addTo(mapa);

/* DESTINO */

mapa.on('click', function(e){

    destinoLat = e.latlng.lat;
    destinoLong = e.latlng.lng;

    console.log("Destino:");
    console.log(destinoLat, destinoLong);

    if(marcadorDestino){

        mapa.removeLayer(marcadorDestino);

    }

    marcadorDestino = L.marker([
        destinoLat,
        destinoLong
    ])
    .addTo(mapa)
    .bindPopup("Destino selecionado")
    .openPopup();

});

/* BOTÃO */

document.getElementById("iniciar")
.addEventListener("click", ()=>{

    if(destinoLat === null ||
       destinoLong === null){

        alert("Selecione um destino no mapa.");

        return;
    }

    localStorage.setItem(
        "destinoLat",
        destinoLat
    );

    localStorage.setItem(
        "destinoLong",
        destinoLong
    );

    const raio =
    document.getElementById("raio").value;

    localStorage.setItem(
        "raio",
        raio
    );

    window.location.href =
    "viagem.html";

});