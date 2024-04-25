const handleRegister = (req, res, db, bcrypt) => {
    console.log("Request body:", req.body);
    const { email, name, password } = req.body;
    if(!email || !name || !password) {
        //If no Register information is inserted then return an error in the console and on network response
        return res.status(400).json( {error: 'Incorrect form submission'} );
    }
    const hash = bcrypt.hashSync(password);//Encrypt the password
    db.transaction(trx => {//Use transaction when i have to do more than two things at oncex`
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({//Using insert method of knex, database communicates with server, and registered first user
                email:loginEmail[0].email,
                name:name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)//if all of this passes and there are no errors then commit
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))
}

//Exporting the function
export default handleRegister;