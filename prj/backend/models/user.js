const db = require('../util/database');

module.exports = class User {
    constructor(CF, name, surname, email, password) {
        this.CF = CF;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }

    static find(email) {
        return db.execute(
            'SELECT * FROM utenti WHERE email = ?', [email]
        );
    }

    static save(user) {
        return db.execute(
            'INSERT INTO utenti (CF, nome, cognome, email, password) '
            + 'VALUES (?, ?, ?, ?, ?)', [
                user.CF, user.name, user.surname, user.email, user.password
            ]
        );
    }

};
