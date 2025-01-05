var data = getLoginInfo();
const usersContainer = document.querySelector(".users-container");
const machineContainer = document.querySelector(".machines-container");

var _users = [];
var _tipologie = [];

Promise.all([getAllUsers(), getAllTipologieUtenti()])
.then(([users, tipologie]) => {
    console.log(users, tipologie);
    _tipologie = tipologie;
    _users = users;
    reloadUsersRows(users);
})

getAllCamion().then(camion => {
    console.log(camion);
    reloadCamionRows(camion);
})

function reloadUsersRows(users) {
    usersContainer.innerHTML = "";
    createTableHeader(usersContainer, ["Nome", "Cognome", "Codice Fiscale", "Telefono", "Email", "Indirizzo", "Tipologia", "Salario"]);
    var body = document.createElement("tbody");
    users.forEach(user => {
        var tipologia = _tipologie.find(x => x.codice === user.tipo_contratto);
        var row = document.createElement("tr");
        row.className = "table-row";
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

function reloadCamionRows(camions) {
    machineContainer.innerHTML = "";
    createTableHeader(machineContainer, ["Targa", "Modello", "Numero di telaio", "Data acquisizione", "Anno immatricolazione"]);
    var body = document.createElement("tbody");
    camions.forEach(camion => {
        var row = document.createElement("tr");
        row.className = "table-row";
        addCell(row, camion.targa);
        addCell(row, camion.modello);
        addCell(row, camion.numero_telaio);
        addCell(row, camion.data_acquisizione);
        addCell(row, camion.anno_immatricolazione);
        body.appendChild(row);
    })
    machineContainer.appendChild(body);
}
