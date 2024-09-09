const corsaPK = getExtraData();
console.log(corsaPK.inizio, corsaPK.camion)
corsaPK.inizio = new Date(corsaPK.inizio);

const usersContainer = document.getElementById('users-container');
const pageTitle = document.getElementById('page-title');
pageTitle.innerText = `Assegnazione utenti alla corsa del ${corsaPK.inizio.toLocaleString()} - con camion ${corsaPK.camion}`;

const userSelect = document.getElementById('user-select');
addDefaultOption('Seleziona utente', userSelect);

let assignedUsers = [];
let switchValue = false;

loadAssignedUsers().then(() => {
    getAllUsers().then(users => 
        users.filter(u => assignedUsers.indexOf(u.cf) == -1)
        .sort((u1,u2) => u1.nome.localeCompare(u2.nome))
        .forEach(u => addOption(
            u.cf,
            u.nome + ' ' + u.cognome + ' (' + u.cf + ')',
            userSelect
        )
    ));
})


function loadAssignedUsers() {
    return getUtentiCorsa(corsaPK.inizio, corsaPK.camion)
    .then(r => {
        usersContainer.innerHTML = '';
        console.log(r)
        if (r == null) {
            usersContainer.innerHTML = `<p>Nessun utente assegnato a questa corsa</p>`;
        } else {
            const h2 = document.createElement('h2');
            h2.innerText = `Utenti assegnati a questa corsa:`;
            usersContainer.appendChild(h2);
            r.forEach(u => {
                const row = document.createElement('p');
                row.classList.add('user-row');
                row.innerText = `${u.nome} ${u.cognome} (${u.cf})`;
                if (u.guida) {
                    row.innerText += ' (guida)';
                }
                usersContainer.appendChild(row);
                assignedUsers.push(u.cf);
            })
        }
    });
}

let debouncing = false;
function toggleSwitch() {
    if (!debouncing) {
        debouncing = true;
        switchValue = !switchValue;
        setTimeout(() => {
            debouncing = false;
        }, 100);
    }
}

function assignUser() {
    const userCF = userSelect.value;
    const isDriving = switchValue;
    addEsecuzione(corsaPK.inizio, corsaPK.camion, userCF, isDriving);
}


