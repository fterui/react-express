var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  const count = (req.session.count || 0)+1;
  req.session.count = count;
  res.json({
    login: !!req.user,
    given_name: req.user?.given_name,
    count
  });
});

module.exports = router;
