const carichiPopup = document.getElementById('caricoPopup');
const routePopup = document.getElementById('routePopup');
createDialogFrom(
    'caricoPopup', 
    'padding: 50px; width: 20%; gap: 30px; left: 35%;'
);
createDialogFrom(
    'routePopup', 
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
        lot.innerText = corsa.carico + " (" + corsa.Carichi.peso + " kg)"
        cDiv.appendChild(lot);
    } else {
        const btn = document.createElement("button");
        btn.innerText = "Assegna carico";
        btn.onclick = (event) => {
            const {dateTime, tag} = getDateTag(event);
            getCarichiSelect(dateTime, tag)
        }
        cDiv.appendChild(btn);
    }

    if (corsa.rotta) {
        const rotta = document.createElement("span");
        rotta.innerText = corsa.Rotte.descrizione
        cDiv.appendChild(rotta);
    } else {
        const btn = document.createElement("button");
        btn.innerText = "Assegna rotta";
        btn.onclick = (event) => {
            // TODO: apri pagina per assegnare rotta
            const {dateTime, tag} = getDateTag(event);
            getRotteSelect(dateTime, tag)
        }
        cDiv.appendChild(btn);
    }

    const btn = document.createElement("button");
    btn.innerText = "Assegna utenti";
    btn.onclick = () => redirectToPage("assegnazione-utenti.php", getLoginInfo());
    cDiv.appendChild(btn);

    cList.appendChild(cDiv);
}

function getDateTag(event) {
    let dateStr = event.target.parentElement.children[0].innerText;
    let [date, time] = dateStr.split(', ');
    let [day, month, year] = date.split('/');
    date = month + "/" + day + "/" + year;
    const dateTime = new Date(date + "Z" + time + "+2");
    const tag = event.target.parentElement.children[1].innerText;
    return {dateTime, tag};
}

function getCarichiSelect(dateTime, tag) {
    toggleDialog('caricoPopup').then(visible => {
        if (visible) {
            getAllCarichi().then(carichi => {
                const sel = getPopupSelect("carichiDdl", "Scegli carico da assegnare");
                carichi.forEach((carico) => {
                    const text = carico.lotto + " (" + carico.peso + " kg)";
                    addOption(carico.lotto, text, sel)
                });
                carichiPopup.appendChild(sel);
                
                let btn = getPopupBtn("Assegna");
                btn.onclick = () => assignCaricoAndClosePopup(dateTime, tag, +sel.value);
                carichiPopup.appendChild(btn);

                btn = getPopupBtn("Crea nuovo carico")
                btn.onclick = () => {
                    addCarico().then(carico => {
                        if (carico != null) {
                            assignCaricoAndClosePopup(dateTime, tag, +carico.lotto);
                        }
                    })
                }
                carichiPopup.appendChild(btn);
            });
        }
    });
}

function assignCaricoAndClosePopup(dateTime, tag, lot) {
    setCaricoCorsa(dateTime, tag, lot)
        .then((ok) => {
            if (ok) toastSuccess('Carico assegnato');
            toggleDialog('caricoPopup');
            reloadCorseList();
        });
}

function assignRouteAndClosePopup(dateTime, tag, routeId) {
    setRottaCorsa(dateTime, tag, routeId)
        .then((ok) => {
            if (ok) toastSuccess('Rotta assegnata');
            toggleDialog('routePopup');
            reloadCorseList();
        });
}

function getPopupBtn(text) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.style.background = "var(--secondary-color)";
    btn.style.color = "var(--primary-color)";
    return btn;
}

function getPopupSelect(selectId, placeholder) {
    const sel = document.createElement('select');
    sel.name = selectId;
    sel.id = selectId;
    sel.style.background = "var(--secondary-color)";
    addDefaultOption(placeholder, sel);
    return sel;
}

function getRotteSelect(dateTime, tag) {
    toggleDialog('routePopup').then(visible => {
        if (visible) {
            getAllRoutes().then(routes => {
                const sel = getPopupSelect("routesDdl", "Scegli rotta da assegnare");
                routes.forEach((route) => addOption(route.codice, route.descrizione, sel));
                routePopup.appendChild(sel);
                let btn = getPopupBtn("Assegna");
                btn.onclick = () => assignRouteAndClosePopup(dateTime, tag, +sel.value);
                routePopup.appendChild(btn);
            })
        }
    });
}
