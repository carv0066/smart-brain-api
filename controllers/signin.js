const handleSignin = (req, res, db, bcrypt) => {

    db.select('email', 'hash').from('login')//db for the knex connection to the database, from there I grab email and hash from login table
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);// Comparing if the password typed by the user is the same password as the one in the database
        if (isValid) {
            return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('Wrong credentials')
        }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
}

//Exporting the function
module.exports = {
    handleSignin: handleSignin
}