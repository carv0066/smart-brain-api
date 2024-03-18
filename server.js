const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const  cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',//Local host number
        user : 'postgres',
        password : 'smartbrain', // Adding password for the database
        database : 'smart-brain',
        port: 5432 // Correct port number for PostgreSQL
    }
});

const app = express();


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', (req, res) => {

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
})


app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
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
})

app.get('/profile/:id', (req, res) => {//confirming if the user exists or not
    const { id } = req.params;

db.select('*').from('users').where({id})
    .then(user => {
        if(user.length) {
            res.json(user[0])
    } else {
        res.status(400).json('not found')
    }
})
.catch(err => res.status(400).json('error getting the user'))
})


app.put('/image', (req, res) => {//Updating entries everytime a new image is entered on the input bar
    const { id } = req.body;
        db('users').where('id', '=', id)//Where id is equal to the id we receive from the body
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('Unable to get entries'))
})


app.listen(3000, () => {
    console.log('App is running on port 3000');
})

/*
/ --> res  = this is working
/sign in --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT  --> user 
*/