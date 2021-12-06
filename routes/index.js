const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc      Login/Landing page
// @route     GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login' });
});

// @desc      Dashboard page
// @route     GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  console.log(req.user);
  try {
    const stories = await Story.find({ user: req.user._id }).lean();
    res.render('dashboard', {
      name: req.user.lastName,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('errors/500');
  }
});

module.exports = router;
