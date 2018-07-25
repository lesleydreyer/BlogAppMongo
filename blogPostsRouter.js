const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


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
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

//when new blogpost item posted, ensure has required fields 
//(title, content, author, (publishDate is not required)) and if not log 
//an error and return 400 status code, or if ok add new item to blogposts 
//and return with 201
router.post('/', jsonParser, (req, res) => {
    //ensure correct fields in request body
    const requiredFields = ['title', 'content', 'author'];
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

//try to delete blogitem when comes in with id in path
router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post item \`${req.params.ID}\``);
    res.status(204).end();
});

//put request to update item, ensure has required fields and id is in url 
//path and item id matches in updated item object match. if problems log 
//error and send 400, otherwise call update
router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
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

module.exports = router;