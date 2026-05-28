const historico = JSON.parse(
    localStorage.getItem(
        "historicoViagens"
    )
) || [];

const lista =
document.getElementById(
    "historico-lista"
);

/* MOSTRAR HISTÓRICO */

historico.reverse().forEach((viagem)=>{

    const item =
    document.createElement("div");

    item.classList.add(
        "viagem"
    );

    /* DATA */

    const dataFormatada =
    viagem.data;

    /* LOCAL */

    const local =
    viagem.local ||
    "Local desconhecido";

    item.innerHTML = `

        <span>${local}</span>

        <span>${dataFormatada}</span>

    `;

    lista.appendChild(item);

});

/* BOTÃO INÍCIO */

document.querySelector(".inicio")
.addEventListener("click", ()=>{

    window.location.href =
    "geoalert.html";

});