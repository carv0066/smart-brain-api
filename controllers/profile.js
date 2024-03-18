const handleProfile = (req, res, db) => {//confirming if the user exists or not
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
}

module.exports = {
    handleProfile: handleProfile
}