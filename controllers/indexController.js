exports.getHomepage = function (req, res) {
    res.render('index', {
        breadcrumbs: req.breadcrumbs(),
    });
}
