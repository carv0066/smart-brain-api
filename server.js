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


const database = {//Temporary Database
    users : [
            {
                id: '123',
                name: 'John',
                email: 'john@gmail.com',
                password: 'cookies',
                entries: 0,
                joined: new Date()
            },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login : [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    }else {
        res.status(400).json('error logging in');
    }

})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
    .returning('*')
    .insert({//Using insert method of knex, database communicates with server, and registered first user
        email:email,
        name:name,
        joined: new Date()
    }).then(user => {
        res.json(user[0]);
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