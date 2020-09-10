// Instantiation
const express = require('express');
const exphbs = require('express-handlebars');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/'});
const mongoose = require('mongoose', () => {

});

const port = process.env.PORT || 3000;

// const users = [];


// Connexion into the DataBase
mongoose.connect('mongodb://localhost:27017/upload', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err, upload) => {
    if (err !== null) {
        console.log('DB is not connected. Err:', err);
        return;
    }
    console.log('DB connected');
});

// Définir une fois le schéma de notre conception de BD
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true,
        index: true
    },
    firstName : String,
    surname: String,
    profilePicture: String,
    created: {
        type: Date,
        default: Date.now
    }
})

// Définir le modèle une fois
const User = mongoose.model("User", userSchema); // la chaîne "Car" est l'identifiant unique Mongoose de votre modèle. Il créera également automatiquement une collection appelée `cars`


// Express configuration
const app = express();

app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');



// Get the req.body

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());


// Routes
app.get('/', (req, res) => {
    console.log('GET /');
    res.render('home');
});

app.post('/upload', upload.single('avatar'), (req, res) => {
    console.log('POST /upload req.file:', req.file.path);
    console.log('POST /upload req.body:', req.body);
    const path = req.file.path;
    const { username} = req.body;
    console.log("username:", username);
    console.log("path:", path);

    const newUser = new User({
        username,
        path
    });
    console.log("newUser:", newUser);

    newUser.save((err, userdb) => {
        console.log("err", err);
        console.log("userdb", userdb);

        if(err !== null) {
            res.send("Did not save user err:", err);
            return;
        }
        res.send(`Name ${username} received`);
    });


    // Sauvegarder le fichier en BD à l'aide du path
});





// Listen
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})




