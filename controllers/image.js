import fetch from 'node-fetch'; // Import node-fetch

const Clarifai = require('clarifai');

const returnClarifaiRequestOptions = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentication
    const PAT = "fe496818dcae4370b151fc4bbb9bb7d1";
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = "cjeternal21";
    const APP_ID = "face-recognition-brain";
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = "face-detection";
    // I use the imageUrl parameter so that the image becomes dynamic
    const IMAGE_URL = imageUrl;

    // Setting up the JSON that will be sent to Clarifai
    const raw = JSON.stringify({
        user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
        },
        inputs: [{
            data: {
                image: {
                    url: IMAGE_URL,
                },
            },
        }],
    });

    // Creating requestOptions object for the fetch request
    const requestOptions = {
        method: "POST", // Using the HTTP POST method for the request
        headers: {
            Accept: "application/json", // Specifying that the response should be in JSON format
            Authorization: "Key " + PAT, // Including the Clarifai API key in the request headers
        },
        body: raw, // Including the JSON data in the request body
    };

    return requestOptions;
};


const handleApiCall = (req, res) => {
    // Making a fetch request to the Clarifai API
    fetch(
        "https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",
        returnClarifaiRequestOptions(req.body.input)
    )
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json("unable to work with API"));
};



const handleImage = (req, res, db) => { // Updating entries every time a new image is entered on the input bar
    const { id } = req.body;
    db('users').where('id', '=', id) // Where id is equal to the id we receive from the body
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('Unable to get entries'));
};

export default {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};
