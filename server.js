const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostsRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));
//app.use(express.json());
app.use("/blog-posts", blogPostRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//when requests come into /blog-posts, route them to express router
//instances we've imported that will act as modular, mini-express apps
app.use('/blog-posts', blogPostRouter);


// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchrnously starting
// our server, since we'll be dealing with promises there.
function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
      app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
    });
  }

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          reject(err);
          // so we don't also call `resolve()`
          return;
        }
        resolve();
      });
    });
  }
  
  // if server.js is called directly (aka, with `node server.js`), this block
  // runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
  if (require.main === module) {
    runServer().catch(err => console.error(err));
  }
  
  module.exports = { app, runServer, closeServer };
  

/////////////////////



/*const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

//add some items so there's some data to look at
BlogPosts.create('The Best Tacos in the East Valley', 
                'There are several delicious taco joints but I think the best ones are Ghett yo Taco, Barrio Queen and Joyride', 
                'Lesley Dreyer', 
                1519129853500);
BlogPosts.create('What Shows to Watch this Summer', 
                'I would watch Code Black, Glow, Whose Line is it Anyway and Castlerock', 
                'Lesley Dreyer', 
                1519129853600);

//when root of router called with GET, return all current BlogPosts items                
app.get('/blog-posts', (req, res) => {
    res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
    //ensure correct fields in request body
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});

app.delete('/blog-posts/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post item \`${req.params.ID}\``);
    res.status(204).end();
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id != req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post item \`${req.params.id}\``);

    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });

    res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});*/