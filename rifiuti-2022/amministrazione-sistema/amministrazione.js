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

function reloadUsersRows(users) {
    usersContainer.innerHTML = "";
    users.forEach(user => {
        var tipologia = _tipologie.find(x => x.codice === user.tipo_contratto);
        var row = document.createElement("tr");
        row.className = "table-row";
        row.innerHTML = `
            <td style="flex-grow: 1;">${user.nome}</td>
            <td style="flex-grow: 1;">${user.cognome}</td>
            <td style="flex-grow: 2;">${user.cf}</td>
            <td style="flex-grow: 1;">${user.telefono}</td>
            <td style="flex-grow: 2;">${user.email}</td>
            <td style="flex-grow: 2;">${user.indirizzo}</td>
            <td style="flex-grow: 1;">${tipologia?.descrizione ?? ""}</td>
            <td style="flex-grow: 1;">€ ${user.salario}</td>
        `;
        usersContainer.appendChild(row);
    });
}
