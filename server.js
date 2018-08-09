const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//Mongoose internally uses a promise-like object,
//but it's better to make Monguoose user built in es6 promises
mongoose.Promise = global.Promise;

//config.js is where we control constants for entire 
//app like PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require ('./config');
const {BlogPost} = require('./models');

const app = express();
app.use(express.json());

//const blogPostRouter = require('./blogPostsRouter');

// log the http layer
app.use(morgan('common'));

//app.use(express.static('public'));
//app.use("/blog-posts", blogPostRouter);

app.get('/posts', (req, res) => {
    //res.sendFile(__dirname + '/views/index.html');
    BlogPost
        .find()
        .then(posts => {
            res.json({
                posts: posts.map(post => post.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error"});
        });
});
app.get("/posts/:id", (res, req) => {
    BlogPost
    //this is a conveninece method Mongoose provides for
    //searching by the  object _id property
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Interal server error" });
    });
});

app.post("/posts", (req, res) => {
    const requiredFields = ["title", "content", "author"];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    
    BlogPost
        .create({
            title: req.body.title,
            content: req.body.content, 
            author: req.body.author 
            //publishDate: req.body.publishDate
        })
        .then(post => res.status(201).json(post.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error"});
    });
});

app.put("/posts/:id", (req, res) => {
    //ensure id in req path and req body match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = 
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).json({ message: message });
    }

    //we only support a subset of fields being updateable.
    //if the user sent over any of the updateable fields,
    //we update those values in document
    const toUpdate = {};
    const updateableFields = ["title", "content", "author"];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    BlogPost
    //all key/value pairs in toUpdate will update is what $set does
        .findbyIdAndUpdate(req.params.id, { $set: toUpdate })
        .then(post => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error"}));

});

app.delete("/post/:id", (req, res) => {
    BlogPost
        .findByIdAndRemove(req.params.id)
        .then(post => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }));
});

//catch-all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res) {
    res.status(404).json({ message: "Not found" });
});

//closeServer needs access to aserver object, but that only
//gets created when `runServer` runs, so we declare `server`
//here and then assign a value to it in run
let server;

//function to connect to database, then start server
function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                    .listen(port, () => {
                        console.log(`Your app is listening on port ${port}`);
                        resolve();
                    })
                    .on("error", err => {
                        mongoose.disconnect();
                        reject(err);
                    });
            });
    });
}

//this function closes the server and returns a promise
//to use in integration tests later
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing server");
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

//if server.js is called directly (node server.js)
//this runs but also export the runserver command so other
//code like test code can start server
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

