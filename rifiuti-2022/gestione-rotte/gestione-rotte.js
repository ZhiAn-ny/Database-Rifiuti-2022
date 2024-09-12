
loadRoutes()

function loadRoutes() {
    getAllRoutes().then((routes) => {
        console.log(routes);
        showRoutes(routes);
    })
}

function addRoute() {
    const input = document.getElementById("new-route-name");
    let name = input.value.trim();
    if (name.length > 0) {
        addNewRoute(name).then(() => loadRoutes());
    } else {
        toastError("Il nome della rotta non può essere vuoto.");
    }
}

function showRoutes(routes) {
    const list = document.getElementById("routes-list");
    list.innerHTML = "";
    routes.forEach(route => {
        const item = document.createElement("li");
        const div = getEditDeleteBtns(route);
        const p = document.createElement("p");
        p.innerText = route.descrizione;
        item.appendChild(p);
        item.appendChild(div);
        list.appendChild(item);
    });
}

function getEditDeleteBtns(route) {
    const div = document.createElement("div");
    let btn = document.createElement("button");
    btn.innerText = "Elimina";
    btn.addEventListener("click", () => {
        console.log("elimina rotta", route.codice);
        deleteRoute(route.codice).then(() => loadRoutes());
    })
    div.appendChild(btn);
    btn = document.createElement("button");
    btn.innerText = "Modifica";
    btn.addEventListener("click", () => {
        editRoute(route);
    })
    div.appendChild(btn);
    return div
}

function editRoute(route) {
    const section = document.getElementById("route-edit-section");
    section.innerHTML = "";
    getRouteStops(route.codice).then((stops) => {
        let p = document.createElement("p");
        p.innerText = "Stai modificando la rotta: " + route.descrizione;
        
        const list = getStopsList(stops);
        const div = getNewStopDiv(route.codice);
        list.appendChild(div);
        
        section.appendChild(p);
        section.appendChild(list);
    });
}

function getStopsList(stops) {
    const list = document.createElement("ul");
    stops.sort((t1, t2) => t2.precedente == t1.successiva ? -1 : 1)
        .forEach(stop => {
            const p = document.createElement("li");
            p.innerText = stop.descrizione + ' - '
                + stop.Stabilimenti.descrizione + ' ('
                + stop.Stabilimenti.indirizzo + ')';
            list.appendChild(p);
        });
    return list;
}

function getNewStopDiv(routeId) {
    const div = document.createElement("div");
    div.classList.add("s-btw");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Inserisci nome tappa";
    div.appendChild(input);
    const select = document.createElement("select");
    addDefaultOption('Seleziona stabilimento', select);
    fetchAllStabilimenti().then((stabilimenti) => {
        stabilimenti.forEach(s => {
            addOption(
                s.comune + '|' + s.zona + '|' + s.codice,
                s.descrizione,
                select
            )
        })
    })
    const addBtn = document.createElement("button");
    addBtn.innerText = "Aggiungi fermata";
    addBtn.addEventListener("click", () => {
        console.log("Aggiungi fermata", routeId, input.value, select.value);
    })
    div.appendChild(select);
    div.appendChild(addBtn);
    return div;
}