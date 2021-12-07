const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc      Add Stories page
// @route     GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  return res.render('stories/add');
});

// @desc      Create Stories page
// @route     POST /stories/add
router.post('/add', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user._id;
    await Story.create(req.body);
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('errors/500');
  }
});

// @desc      Show All Stories
// @route     GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createAt: 'desc' })
      .lean();
    return res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    return res.render('errors/404');
  }
});

// @desc      Show Detail page
// @route     GET /stories/id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('user').lean();

    if (!story) {
      return res.render('errors/404');
    }
    console.log(story.user);
    const isNotOwner = story.user._id.toString() !== req.user._id;
    const isPrivateStatus = story.status === 'private';

    if (isNotOwner && isPrivateStatus) {
      console.log('kkk');
      return res.render('errors/404');
    }

    return res.render('stories/show', {
      story,
    });
  } catch (err) {
    console.error(err);
    return res.render('errors/404');
  }
});

// @desc      Show Edit page
// @route     GET /stories/edit/id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return res.render('errors/404');
    }

    const isOwner = story.user.toString() === req.user._id;

    if (!isOwner) {
      return res.render('errors/404');
    }

    return res.render('stories/edit', {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render('errors/404');
  }
});

// @desc      Show Update page
// @route     PUT /stories/edit/id
router.put('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render('errors/404');
    }

    const isOwner = story.user.toString() === req.user._id;

    if (!isOwner) {
      return res.render('errors/404');
    }

    await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('errors/500');
  }
});

// @desc      Delete story by Id
// @route     DELETE /stories/id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render('errors/404');
    }

    const isOwner = story.user.toString() === req.user._id;

    if (!isOwner) {
      return res.render('errors/404');
    }

    await Story.remove({ _id: req.params.id });

    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('errors/500');
  }
});

router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();

    return res.render('stories/index', { stories });
  } catch (err) {
    console.error(err);
    return res.render('errors/500');
  }
});

module.exports = router;
