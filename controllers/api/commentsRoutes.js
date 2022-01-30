const router = require('express').Router();
const { Playlist, Comment } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({ include: { model: Playlist } });
    const comments = commentData.map(comment => comment.get({ plain: true }));
    console.log(comments)
    res.status(200).json(comments)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      playlist_id: req.body.playlist_id,
      user_id: req.session.user_id
    });
    res.status(200).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id, { include: { model: Playlist } });
    const comment = commentData.get({ plain: true });
    res.status(200).json(comment)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
