var data = getLoginInfo();
const usersContainer = document.querySelector(".users-container");
const machineContainer = document.querySelector(".machines-container");
const newUserPopup = document.getElementById('newUserPopup');
const newMachinePopup = document.getElementById('newMachinePopup');
createDialogFrom(
    'newUserPopup',
    'padding: 50px; width: 40%; height: 70%; gap: 30px; left: 25%;'
);
createDialogFrom(
    'newMachinePopup',
    'padding: 50px; width: 40%; gap: 30px; left: 25%;'
);

var _tipologie = [];

getAllTipologieUtenti()
    .then(tipologie => { _tipologie = tipologie })
    .then(() => { reloadUsers() });

reloadCamions();

function reloadCamions() {
    getAllCamion().then(camion => {
        console.log(camion);
        refreshCamionTable(camion)
    });
}

function reloadUsers() {
    getAllUsers().then(users => {
        users = users.sort((u1,u2) => u1.nome.toLowerCase().localeCompare(u2.nome.toLowerCase()))
        console.log(users);
        refreshUsersTable(users)
    });
}

function refreshUsersTable(users) {
    usersContainer.innerHTML = "";
    createTableHeader(usersContainer, [
        "Azioni","Nome", "Cognome", "Codice Fiscale", "Telefono", "Email",
         "Indirizzo", "Tipologia", "Salario"
    ]);
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
    createTableHeader(machineContainer, [
        "Azioni", "Targa", "Modello", "Numero di telaio", "Data acquisizione",
        "Anno immatricolazione"
    ]);
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

function showDialog(dialogId) {
    var dialog = document.getElementById(dialogId);
    toggleDialog(dialogId).then(isVisible => {
        if (isVisible && dialogId == 'newUserPopup') {
            createUserForm(dialog);
        }
    });
}

function createUserForm(dialog) {
    var div = document.createElement("div");
    div.className = "form-input-text"
    var label = document.createElement("span");
    label.innerText = "Tipo contratto";
    div.appendChild(label);
    createDropdown(
        "tipo_contratto",
        _tipologie.map(x => ({ value: x.codice, text: x.descrizione })),
        div,
        _tipologie[0].descrizione, _tipologie[0].codice
    );
    div.querySelector('select').className = "form-select";
    dialog.appendChild(div);
    
    input = inputField("Salario", "");
    input.querySelector("input").type = 'number'
    input.querySelector("input").required = true;
    dialog.appendChild(input);

    [
        { field: "Nome", type: "text", required: true },
        { field: "Cognome", type: "text", required: true },
        { field: "Codice Fiscale", type: "text", required: true },
        { field: "Indirizzo", type: "text", required: false },
        { field: "Telefono", type: "number", required: false },
        { field: "Email", type: "email", required: true },
        { field: "Password", type: "password", required: true },
    ].forEach(x => {
        var input = inputField(x.field, "");
        input.querySelector("input").type = x.type;
        input.querySelector("input").required = x.required;
        dialog.appendChild(input);
    })

    var btn = document.createElement("button");
    btn.className = "form-btn";
    btn.innerText = "Crea utente";
    btn.onclick = () => {
        if (checkNewUserData(dialog)) {
            saveNewUser(dialog).then(() => {reloadUsers()});
        }
    }
    dialog.appendChild(btn);
}

function checkNewUserData(dialog) {
    var fields = dialog.querySelectorAll("input, select");
    for (field of fields) {
        // Ignores the step mismatch error
        if (!field.validity.valid && !field.validity.stepMismatch) {
            toastError("Il campo \"${field.title}\" non ha un valore valido");
            return false;
        }
    }
    return true;
}

function saveNewUser(dialog) {
    var user = {
        nome: dialog.querySelector("input[title='Nome']").value ?? "",
        cognome: dialog.querySelector("input[title='Cognome']").value ?? "",
        cf: dialog.querySelector("input[title='Codice Fiscale']").value ?? "",
        telefono: dialog.querySelector("input[title='Telefono']").value ?? "",
        email: dialog.querySelector("input[title='Email']").value ?? "",
        password: dialog.querySelector("input[title='Password']").value ?? "",
        indirizzo: dialog.querySelector("input[title='Indirizzo']").value ?? "",
        salario: dialog.querySelector("input[title='Salario']").value ?? "",
        tipo_contratto: dialog.querySelector("select").value ?? "",
        attivo: 1,
        data_assunzione: new Date().toISOString()
    }
    createUser(user).then(() => {
        toastSuccess("Utente creato con successo");
        toggleDialog('newUserPopup');
        reloadUsers();
    })
}