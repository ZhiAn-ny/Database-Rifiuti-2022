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
        .then(ok => {
            if (ok) reloadCorseList();
        })
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
        btn.onclick = (event) => {
            // TODO: apri pagina per assegnare carico
            let dateStr = event.target.parentElement.children[0].innerText;
            let [date, time] = dateStr.split(', ');
            let [day, month, year] = date.split('/');
            date = month + "/" + day + "/" + year;
            const dateTime = new Date(date + "Z" + time + "+2");
            const tag = event.target.parentElement.children[1].innerText;
            getCarichiSelect(dateTime, tag)
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
            toastSuccess();
        }
        cDiv.appendChild(btn);
    }

    const btn = document.createElement("button");
    btn.innerText = "Assegna utenti";
    btn.onclick = () => redirectToPage("assegnazione-utenti.php", getLoginInfo());
    cDiv.appendChild(btn);

    cList.appendChild(cDiv);
}

function getCarichiSelect(dateTime, tag) {
    toggleDialog('caricoPopup').then(visible => {
        if (visible) {
            getAllCarichi().then(carichi => {
                const sel = document.createElement('select');
                sel.name = "carichiDdl";
                sel.id = "carichiDdl";
                sel.style.background = "var(--secondary-color)";
                addDefaultOption("Scegli carico da assegnare", sel);
                carichi.forEach((carico) => {
                    const text = carico.lotto + " (" + carico.peso + ")";
                    addOption(carico.lotto, carico.lotto, sel)
                });
                carichiPopup.appendChild(sel);
                
                let btn = document.createElement("button");
                btn.innerText = "Assegna";
                btn.style.background = "var(--secondary-color)";
                btn.style.color = "var(--primary-color)";
                btn.onclick = () => {
                    setCaricoCorsa(dateTime, tag, +sel.value)
                        .then(() => {
                            toggleDialog('caricoPopup');
                            reloadCorseList();
                        });
                }
                carichiPopup.appendChild(btn);

                btn = document.createElement("button");
                btn.innerText = "Crea nuovo carico";
                btn.style.background = "var(--secondary-color)";
                btn.style.color = "var(--primary-color)";
                btn.onclick = () => {
                    addCarico().then(carico => {
                        if (carico != null)
                            setCaricoCorsa(dateTime, tag, +carico.lotto)
                                .then(() => {
                                    toggleDialog('caricoPopup');
                                    reloadCorseList();
                                });
                    })
                }
                carichiPopup.appendChild(btn);
            });
        }
    });
}
