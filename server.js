import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfile from "./controllers/profile.js";
import { handleImage, handleApiCall } from "./controllers/image.js";

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        host : process.env.DATABASE_HOST,//Local host number
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PW, // Adding password for the database
        database : process.env.DATABASE_DB,
        port: 5432 // Correct port number for PostgreSQL
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Made some changes to the imports.
app.get('/', (req, res) => { res.send('success') })
app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { handleProfile(req, res, db) })
app.put('/image', (req, res) => { handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { handleApiCall(req, res) })
app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT}`);
})

