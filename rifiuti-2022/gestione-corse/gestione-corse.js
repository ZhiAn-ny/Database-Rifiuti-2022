const carichiPopup = document.getElementById('caricoPopup');
createDialogFrom(
    'caricoPopup', 
    'padding: 50px; width: 20%; gap: 30px; left: 35%;'
);

getAllCorse().then((corse) => {
    const corseList = document.getElementById("corse-list");
    corse.forEach((corsa) => {
        addCorsaToList(corsa, corseList);
    })
})

getAllCamion().then((camion) => {
    const select = document.getElementById('camionDdl');
    addDefaultOption('Scegli camion', select);
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
            getCarichiSelect()
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

function getCarichiSelect() {
    toggleDialog('caricoPopup').then(visible => {
        if (visible) {
            getAllCarichi().then(carichi => {
                const sel = document.createElement('select');
                sel.name = "carichiDdl";
                sel.id = "carichiDdl";
                sel.style.background = "var(--secondary-color)";
                addDefaultOption("Scegli carico da assegnare", sel);
                carichi.forEach((carico) => addOption(carico.lotto, carico.lotto, sel));
                carichiPopup.appendChild(sel);
                
                const btn = document.createElement("button");
                btn.innerText = "Assegna";
                btn.style.background = "var(--secondary-color)";
                btn.style.color = "var(--primary-color)";
                
                btn.onclick = () => {
                    console.log('TODO: Assegna carico');
                }
                carichiPopup.appendChild(btn);

                // if (carichiPopup.children.length == 0) {
                //     let p = document.createElement("p");
                //     p.innerText = "Nessun carico disponibile.";
                //     p.style.textAlign = "center";
                //     p.style.color = "var(--secondary-color)";
                //     p.style.fontWeight = "bold";
                //     p.style.marginTop = "20%";
                //     carichiPopup.appendChild(p);
                // }
            });
        }
    });
}
