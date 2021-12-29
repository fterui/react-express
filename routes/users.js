var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.json({
    login: !!req.user,
    given_name: req.user?.given_name
  });
});

module.exports = router;
