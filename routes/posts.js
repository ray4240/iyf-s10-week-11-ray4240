const { protect } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { validatePost } = require('../middleware/validate');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.deleted) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, validatePost, async (req, res) => {
  try {
   const post = new Post({ title: req.body.title, content: req.body.content, author: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', protect, validatePost, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ likes: post.likes });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
