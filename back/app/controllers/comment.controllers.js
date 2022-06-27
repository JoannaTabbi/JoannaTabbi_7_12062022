const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

/**
 * displays one comment related to a post id given
 */

exports.readOneComment = (req, res, next) => {
    
    Comment.findById(req.params.id)
        .then((comment) => {
            if (req.body.imageUrl) {
                comment.imageUrl = `${req.protocol}://${req.get("host")}${comment.imageUrl}`
            };
            res.status(200).json(
                comment, hateoasLinks(req, comment._id)
            );
        })
        .catch((error) => res.status(404).json({
            error
        }));
}

/**
 * displays all the comments related to a post id given
 */
exports.readAllComments = (req, res, next) => {
    Comment.findById(req.params.id)
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

/**
 * creates a new comment related to a post id given
 */

exports.createComment = (req, res, next) => {
    const comment = new Comment({
        userId: req.auth.userId,
        message: req.body.message,
        postId: req.body.postId
    });
    comment
        .save()
        .then((newComment) => {
            Post.findByIdAndUpdate(postId,
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
                newComment, hateoasLinks(req, newComment._id)))
            .catch()
            })    
        .catch((error) => res.status(400).json({
            error
        }));
};

/**
 * Controls one comment likes. The "like" key value equal to 1 gives 
 * a like to the chosen comment : the "likes" value is incremented and 
 * the liker's id is added to the userLiked array. 
 * The "like key value equal to 0 removes the like already given : 
 * the "likes" value is decremented and the liker's id is removed from 
 * the usersLiked array. 
 */

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
                commentUpdated, hateoasLinks(req, commentUpdated._id)
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
                commentUpdated, hateoasLinks(req, commentUpdated._id)
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

/**
 * updates one comment related to a post id given
 */
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
                        commentUpdated, hateoasLinks(req, commentUpdated._id)
                    ))
                    .catch((error) => res.status(400).json({
                        error
                    }));
            }
        });
}
/**
 * deletes one comment related to a post id given.
 */
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
/**
 * Reports a comment for an id given. 
 * The id of the user who reports is added to the usersWhoReported array 
 * and the value of reports is increased by 1. No change if the id of the user who reports
 * is already present in the usersWhoReported array.
 */
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
                        commentUpdated, hateoasLinks(req, commentUpdated._id)
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

/**
 * create hateoas links for comments
 */
 const hateoasLinks = (req, id) => {
    const URI = `${req.protocol}://${req.get("host") + "/api/comments/"}`;
    return [{
            rel: "readOne",
            title: "ReadOne",
            href: URI + id,
            method: "GET"
        },
        {
            rel: "readAll",
            title: "ReadAll",
            href: URI,
            method: "GET"
        },
        {
            rel: "create",
            title: "Create",
            href: URI,
            method: "POST"
        },
        {
            rel: "like",
            title: "Like",
            href: URI + id + "/like",
            method: "POST"
        },
        {
            rel: "update",
            title: "Update",
            href: URI + id,
            method: "PUT"
        },
        {
            rel: "delete",
            title: "Delete",
            href: URI + id,
            method: "DELETE"
        },
        {
            rel: "report",
            title: "Report",
            href: URI + id + "/report",
            method: "POST"
        }
    ];
};