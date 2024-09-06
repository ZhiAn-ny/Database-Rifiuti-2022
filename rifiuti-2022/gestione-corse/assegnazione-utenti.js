const corsaPK = getExtraData();
console.log(corsaPK.inizio, corsaPK.camion)
corsaPK.inizio = new Date(corsaPK.inizio);

const usersContainer = document.getElementById('users-container');
const pageTitle = document.getElementById('page-title');
pageTitle.innerText = `Assegnazione utenti alla corsa del ${corsaPK.inizio.toLocaleString()} - con camion ${corsaPK.camion}`;


getUtentiCorsa(corsaPK.inizio, corsaPK.camion)
.then(r => {
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
            row.innerText = `${u.nome} ${u.cognome}`;
            usersContainer.appendChild(row);
        })
    }
})

