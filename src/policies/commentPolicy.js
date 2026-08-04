function isCommentAuthor(user, comment) {
  return user.id === comment.user_id;
}

module.exports = { isCommentAuthor };
