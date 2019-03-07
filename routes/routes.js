
const router = app => {
    app.get('/api/bookmark', (request, response) => {
        response.json(["Tony","Lisa","Michael","Ginger","Food"]);
    });
}

module.exports = router;
