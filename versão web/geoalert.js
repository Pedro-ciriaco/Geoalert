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
    attribution:
    '&copy; OpenStreetMap contributors'
})
.addTo(mapa);

/* DESTINO PELO MAPA */

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

/* PESQUISA */

const campoPesquisa =
document.getElementById("pesquisa");

campoPesquisa.addEventListener("keypress", async (e)=>{

    if(e.key === "Enter"){

        const local =
        campoPesquisa.value;

        const resposta = await fetch(

            `https://nominatim.openstreetmap.org/search?format=json&q=${local}`

        );

        const dados =
        await resposta.json();

        if(dados.length > 0){

            const latitude =
            parseFloat(dados[0].lat);

            const longitude =
            parseFloat(dados[0].lon);

            mapa.setView(
                [latitude, longitude],
                15
            );

            destinoLat = latitude;
            destinoLong = longitude;

            if(marcadorDestino){

                mapa.removeLayer(
                    marcadorDestino
                );

            }

            marcadorDestino = L.marker([
                latitude,
                longitude
            ])
            .addTo(mapa)
            .bindPopup(local)
            .openPopup();

        }else{

            alert(
                "Local não encontrado."
            );

        }

    }

});

/* BOTÃO */

document.getElementById("iniciar")
.addEventListener("click", ()=>{

    if(destinoLat === null ||
       destinoLong === null){

        alert(
            "Selecione um destino."
        );

        return;
    }

    /* NOME LOCAL */

    const nomeLocal =
    document.getElementById(
        "pesquisa"
    ).value;

    localStorage.setItem(
        "nomeLocal",
        nomeLocal
    );

    /* DESTINO */

    localStorage.setItem(
        "destinoLat",
        destinoLat
    );

    localStorage.setItem(
        "destinoLong",
        destinoLong
    );

    /* RAIO */

    const raioInput =
    document.getElementById(
        "raio"
    ).value;

    const raio = raioInput === ""
    ? 5
    : parseFloat(raioInput);

    localStorage.setItem(
        "raio",
        raio
    );

    /* IR PARA VIAGEM */

    window.location.href =
    "viagem.html";

});

document.querySelector(".historico-btn")
.addEventListener("click", ()=>{

    window.location.href =
    "historico.html";

});