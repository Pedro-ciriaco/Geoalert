const alarme = new Audio("assets/sounds/som_alarme.wav");
let alertaAtivado = false;

const mapa = L.map('map');
let destinoLat = null;
let destinoLong = null;

let usuarioLat = null;
let usuarioLong = null;

let marcadorUsuario;

navigator.geolocation.watchPosition((posicao) => {

    const latitudeUsuario = posicao.coords.latitude;
    const longitudeUsuario = posicao.coords.longitude;

    usuarioLat = latitudeUsuario;
    usuarioLong = longitudeUsuario;

    mapa.setView([latitudeUsuario, longitudeUsuario], 15);

    if(marcadorUsuario){
        mapa.removeLayer(marcadorUsuario);
    }

    marcadorUsuario = L.marker([latitudeUsuario, longitudeUsuario])
    .addTo(mapa)
    .bindPopup("Você está aqui");

    const raio = parseFloat(document.getElementById("raio").value); 
    if(destinoLat !== null && destinoLong !== null){

        const distancia = calcularDistancia(
            latitudeUsuario,
            longitudeUsuario,
            destinoLat,
            destinoLong
        );

        console.log("Distância até destino:");
        console.log(distancia.toFixed(2), "metros");

        if(distancia <= raio && !alertaAtivado){
            alertaAtivado = true;
            alarme.play();
            alert("Você chegou perto do destino!");
            navigator.vibrate(1000);
        }

    }

});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

let marcadorDestino;

mapa.on('click', function(e){

    const latitudeDestino = e.latlng.lat;
    const longitudeDestino = e.latlng.lng;

    destinoLat = e.latlng.lat;
    destinoLong = e.latlng.lng;

    alertaAtivado = false;

    if(usuarioLat !== null && usuarioLong !== null){

    const distancia = calcularDistancia(
        usuarioLat,
        usuarioLong,
        destinoLat,
        destinoLong
    );

    console.log("Distância:");
    console.log(distancia.toFixed(2), "metros");

}

    console.log("Destino:");
    console.log(latitudeDestino, longitudeDestino);

    if(marcadorDestino){
        mapa.removeLayer(marcadorDestino);
    }

    marcadorDestino = L.marker([latitudeDestino, longitudeDestino])
    .addTo(mapa)
    .bindPopup("Destino selecionado")
    .openPopup();

});
function calcularDistancia(lat1, lon1, lat2, lon2){

    const raioTerra = 6371e3;

    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;

    const deltaPhi = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;

    const a =
        Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return raioTerra * c;

}