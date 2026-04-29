const validatePost = (req, res, next) => {
  const { title, content } = req.body;

  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!content || content.trim().length < 10) {
    errors.push('Content must be at least 10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validatePost };