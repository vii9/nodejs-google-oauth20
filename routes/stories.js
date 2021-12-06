const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc      Add Stories page
// @route     GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

// @desc      Create Stories page
// @route     POST /stories/add
router.post('/add', ensureAuth, async (req, res) => {
  
  try {
    req.body.user = req.user._id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('errors/500');
  }
});

module.exports = router;
