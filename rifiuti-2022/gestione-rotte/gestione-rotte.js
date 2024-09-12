
getAllRoutes().then((routes) => {
    console.log(routes);
    const list = document.getElementById("routes-list");
    routes.forEach(route => {
        const item = document.createElement("li");
        const p = document.createElement("p");
        p.innerText = route.descrizione;
        item.appendChild(p);

        const div = document.createElement("div");
        let btn = document.createElement("button");
        btn.innerText = "Elimina";
        btn.addEventListener("click", () => {
            console.log("elimina rotta", route.codice);
        })
        div.appendChild(btn);
        btn = document.createElement("button");
        btn.innerText = "Modifica";
        btn.addEventListener("click", () => {
            console.log("modifica rotta", route.codice);
        })
        div.appendChild(btn);
        item.appendChild(div);
        
        list.appendChild(item);
    });

})

