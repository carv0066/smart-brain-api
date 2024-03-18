const handleImage = (req, res, db) => {//Updating entries everytime a new image is entered on the input bar
    const { id } = req.body;
        db('users').where('id', '=', id)//Where id is equal to the id we receive from the body
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
    handleImage: handleImage
}