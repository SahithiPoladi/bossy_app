const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Task = require('../../models/Task');
const User = require('../../models/User');

// @route   GET api/task/me
// @desc    GET current users task
// @access  Private

// Has the main event name.....something like interview and in that we can add subevents as mentioning company name and date of interview
router.get('/me', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ user: req.user.id }).populate('user', [
      'name'
    ]);

    if (!task) {
      return res.status(400).json({ msg: 'There are no tasks for this user' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/task
// @desc     Create or update user task
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'task name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, due } = req.body;
    // Build profile object
    const taskFields = {};
    taskFields.user = req.user.id;
    if (name) taskFields.name = name;

    try {
      // Using upsert option (creates new doc if no match is found):
      let task = await Task.findOneAndUpdate(
        { user: req.user.id },
        { $set: taskFields },
        { new: true, upsert: true }
      );
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/task
// @desc     Get all tasks
// @access   Public
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('user', ['name']);
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/task/user/:user_id
// @desc     Get task by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const task = await Task.findOne({
      user: req.params.user_id
    }).populate('user', ['name']);

    if (!task) return res.status(400).json({ msg: 'Task not found' });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/task/events
// @desc     Add task events
// @access   Private
router.put(
  '/events',
  [
    auth,
    [
      check('name', 'Task name is required')
        .not()
        .isEmpty(),
      check('description', 'Task description is required')
        .not()
        .isEmpty(),
      check('due', 'Task due date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, due } = req.body;

    const newTask = {
      name,
      description,
      due
    };

    try {
      const task = await Task.findOne({ user: req.user.id });

      task.events.unshift(newTask);

      await task.save();

      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/task/events/:eve_id
// @desc     Delete events from task
// @access   Private
router.delete('/events/:eve_id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = task.events
      .map(item => item.id)
      .indexOf(req.params.eve_id);

    task.events.splice(removeIndex, 1);

    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
