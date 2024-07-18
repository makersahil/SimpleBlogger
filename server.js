const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const articleRouter = require('./routes/articles.route');
const Article = require('./models/articles.model');

const app = express();

const PORT = 5000;

mongoose.connect('mongodb://127.0.0.1:27017/blog')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));;

app.set('view engine', 'ejs');
// app.set('views')

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });

    res.render('articles/index', { articles });
});

app.use('/articles', articleRouter);

app.listen(PORT, () => {
    console.log("Server Started Successfully!");
});