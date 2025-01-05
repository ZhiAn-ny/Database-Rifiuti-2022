var data = getLoginInfo();
const usersContainer = document.querySelector(".users-container");
const machineContainer = document.querySelector(".machines-container");



var _tipologie = [];

getAllTipologieUtenti()
    .then(tipologie => { _tipologie = tipologie })
    .then(() => { reloadUsers() });

reloadCamions();

function reloadCamions() {
    getAllCamion().then(camion => { refreshCamionTable(camion) });
}

function reloadUsers() {
    getAllUsers().then(users => { refreshUsersTable(users) });
}

function refreshUsersTable(users) {
    usersContainer.innerHTML = "";
    createTableHeader(usersContainer, ["Azioni","Nome", "Cognome", "Codice Fiscale", "Telefono", "Email", "Indirizzo", "Tipologia", "Salario"]);
    var body = document.createElement("tbody");
    users.forEach(user => {
        var tipologia = _tipologie.find(x => x.codice === user.tipo_contratto);
        var row = document.createElement("tr");
        row.className = "table-row";
        if (user.cf == data.cf) {
            addCell(row, "");
        } else {
            var btn = document.createElement("button");
            addButtonCell(row, "🗑️", () => { disableUserAndReload(user)}, btn);
        }
        addCell(row, user.nome);
        addCell(row, user.cognome);
        addCell(row, user.cf);
        addCell(row, user.telefono);
        addCell(row, user.email);
        addCell(row, user.indirizzo);
        addCell(row, tipologia?.descrizione ?? "");
        addCell(row, `€ ${user.salario}`);        
        body.appendChild(row);
    });
    usersContainer.appendChild(body);
}

function refreshCamionTable(camions) {
    machineContainer.innerHTML = "";
    createTableHeader(machineContainer, ["Azioni", "Targa", "Modello", "Numero di telaio", "Data acquisizione", "Anno immatricolazione"]);
    var body = document.createElement("tbody");
    camions.forEach(camion => {
        var row = document.createElement("tr");
        row.className = "table-row";
        var btn = document.createElement("button");
        addButtonCell(row, "🗑️", () => {deleteCamionAndReload(camion)}, btn);
        addCell(row, camion.targa);
        addCell(row, camion.modello);
        addCell(row, camion.numero_telaio);
        addCell(row, camion.data_acquisizione);
        addCell(row, camion.anno_immatricolazione);
        body.appendChild(row);
    })
    machineContainer.appendChild(body);
}

function deleteCamionAndReload(camion) {
    deleteCamion(camion).then(() => {reloadCamions()});
}

function disableUserAndReload(user) {
    disableUser(user).then(() => {reloadUsers()});
}
