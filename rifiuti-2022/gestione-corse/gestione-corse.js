

getAllCorse().then((corse) => {
    const corseList = document.getElementById("corse-list");
    corse.forEach((corsa) => {
        addCorsaToList(corsa, corseList);
    })
})

getAllCamion().then((camion) => {
    const select = document.getElementById('camionDdl');
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Scegli camion';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    camion.forEach((cam) => {
        const option = document.createElement('option');
        option.value = cam.targa;
        option.text = cam.modello + " (" + cam.targa + ")";
        select.appendChild(option);
    })
})

function addCorsa() {
    const date = document.getElementById('data').value;
    const time = document.getElementById('ora').value;
    const dateTime = new Date(date + "T" + time + ":00");
    const camion = document.getElementById('camionDdl').value;
    addNewCorsa(dateTime, camion)
        .then(() => reloadCorseList())
        .catch((err) => console.error(err));
}

function reloadCorseList() {
    const corseList = document.getElementById("corse-list");
    corseList.innerHTML = "";
    getAllCorse().then(corse => {
        corse.forEach((corsa) => {
            addCorsaToList(corsa, corseList);
        })
    })
}

function addCorsaToList(corsa, cList) {
    const cDiv = document.createElement("div");
    cDiv.classList.add("corsa-row");
    
    const date = document.createElement("span");
    date.innerText = new Date(corsa.inizio).toLocaleString()
    cDiv.appendChild(date);

    const camion = document.createElement("span");
    camion.innerText = corsa.camion
    cDiv.appendChild(camion);

    if (corsa.carico) {
        const lot = document.createElement("span");
        lot.innerText = corsa.carico
        cDiv.appendChild(lot);
    } else {
        const btn = document.createElement("button");
        btn.innerText = "Assegna carico";
        btn.onclick = () => {
            // TODO: apri pagina per assegnare carico
        }
        cDiv.appendChild(btn);
    }

    if (corsa.rotta) {
        const rotta = document.createElement("span");
        rotta.innerText = corsa.rotta
        cDiv.appendChild(rotta);
    } else {
        const btn = document.createElement("button");
        btn.innerText = "Assegna rotta";
        btn.onclick = () => {
            // TODO: apri pagina per assegnare rotta
        }
        cDiv.appendChild(btn);
    }

    const btn = document.createElement("button");
    btn.innerText = "Assegna utenti";
    btn.onclick = () => redirectToPage("assegnazione-utenti.php", getLoginInfo());
    cDiv.appendChild(btn);

    cList.appendChild(cDiv);
}

