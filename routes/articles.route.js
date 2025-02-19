const express = require('express');

const Article = require('./../models/articles.model')

const articleRouter = express.Router();

articleRouter.get('/', (req, res) => {
    res.send('Route is working!');
})

articleRouter.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

articleRouter.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect('/');
    res.render('articles/show',  { article: article });
})

articleRouter.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
})

articleRouter.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));

articleRouter.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

articleRouter.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`)
        } catch (error) {
            console.log(error);
            res.render(`articles/${path}`, { article: article })
        }
    }
}

module.exports = articleRouter;