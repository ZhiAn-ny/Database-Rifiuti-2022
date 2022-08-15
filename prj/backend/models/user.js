const db = require('../util/database');

module.exports = class User {
    TABLE_NAME = 'users';

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static find(email) {
        console.log(`searching ${email}`)
        return db.execute(
            'SELECT * FROM users WHERE email = ?', [email]
        ).then(res => {
            console.log(`search result: ${res}`)
            return res
        });
    }

    static save(user) {
        console.log(`saving ${user}`)

        return db.execute(
            'INSERT INTO users (name, email, password) '
            + 'VALUES (?, ?, ?)', [
                user.name, user.email, user.password
            ]
        );
    }

};
