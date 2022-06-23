const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

exports.readOneComment = (req, res, next) => {
    Comment.findById(req.params.id)
        .then((comment) => {
            if (req.body.imageUrl) {
                comment.imageUrl = `${req.protocol}://${req.get("host")}${comment.imageUrl}`
            };
            res.status(200).json(
                comment
            );
        })
        .catch((error) => res.status(404).json({
            error
        }));
}

exports.readAllComments = (req, res, next) => {
    Comment.find()
        .then((comments) => {
            comments = comments.map((comment => {
                comment.imageUrl = `${req.protocol}://${req.get("host")}${comment.imageUrl}`;
                return {
                    ...comment._doc
                };
            }))
            res.status(200).json(comments)
        })
        .catch((error => res.status(404).json({
            error
        })))
}

exports.createComment = (req, res, next) => {
    const comment = new Comment({
        userId: req.auth.userId,
        message: req.body.message
    });
    comment
        .save()
        .then((newComment) => {
            Post.findByIdAndUpdate(req.params.id,
                {
                    $push: {
                      comments: newComment._id
                    }
                  }, 
                  {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                  }
                )
            .then(() => res.status(201).json(
                newComment))
            .catch()
            })    
        .catch((error) => res.status(400).json({
            error
        }));
};

exports.likeComment = (req, res, next) => {
    Comment.findById(req.params.id)
    .then((commentFound) => {
      switch (req.body.like) {
        case 1:
          if (!commentFound.usersLiked.includes(req.auth.userId)) {
            Comment.findByIdAndUpdate({
                _id: req.params.id
              }, 
              {
                $inc: {
                  likes: 1
                },
                $push: {
                  usersLiked: req.auth.userId
                }
              }, 
              {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
              })
              .then((commentUpdated) => res.status(200).json(
                commentUpdated
                ))
              .catch((error) => res.status(400).json({
                error
              }));
          } else {
            res
              .status(200)
              .json({
                message: "User has already liked this comment"
              });
          }
          break;  
        case 0:
            if (commentFound.usersLiked.includes(req.auth.userId)) {
            Comment.findByIdAndUpdate({
                  _id: req.params.id
                },
                {
                  $inc: {
                    likes: -1
                  },
                  $pull: {
                    usersLiked: req.auth.userId
                  }
                }, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }
              )
              .then((commentUpdated) => res.status(200).json(
                commentUpdated
                ))
              .catch((error) => res.status(400).json({
                error
              }));
          } else {
            res.status(200).json({
              message: "User's like is already reset"
            })
          }
          break;
      }
    })
    .catch((error) => res.status(404).json({
      error
    }));
}

exports.updateComment = (req, res, next) => {
    Comment.findById(req.params.id)
        .then((comment) => {
            if (!comment) {
                res.status(404).json({
                    error: "No such comment !"
                });
            } else if (comment.userId !== req.auth.userId) {
                res.status(403).json({
                    error: "Unauthorized request!"
                });
            } else {
                Comment.findByIdAndUpdate({
                        _id: req.params.id
                    }, {
                        //...postObject,
                        ...req.body,
                        _id: req.params.id
                    }, {
                        new: true,
                        upsert: true,
                        setDefaultsOnInsert: true
                    })
                    .then((commentUpdated) => res.status(200).json(
                        commentUpdated
                    ))
                    .catch((error) => res.status(400).json({
                        error
                    }));
            }
        });
}

exports.deleteComment = (req, res, next) => {
    Comment.findByIdAndDelete(req.params.id)
        .then((comment) => {
            if (!comment) {
                res.status(404).json({
                    error: "No such comment !"
                });
            } else if (post.userId !== req.auth.userId) {
                res.status(403).json({
                    error: "Unauthorized request!"
                });
            } else {
                res.status(204).json({});
            }
        })
        .catch((error) => res.status(500).json({
            error
        }))
}

exports.reportComment = (req, res, next) => {
    Comment.findById(req.params.id)
        .then((comment) => {
            if (!comment.usersWhoReported.includes(req.auth.userId)) {
                Comment.findByIdAndUpdate({
                        _id: req.params.id
                    }, {
                        $inc: {
                            reports: 1
                        },
                        $push: {
                            usersWhoReported: req.auth.userId
                        }
                    }, {
                        new: true,
                        upsert: true,
                        setDefaultsOnInsert: true
                    })
                    .then((commentUpdated) => res.status(200).json(
                        commentUpdated
                    ))
                    .catch((error) => res.status(400).json({
                        error
                    }))
            } else {
                res
                    .status(200)
                    .json({
                        message: "Post already reported"
                    });
            }
        })
        .catch((error) => res.status(400).json(error))
};