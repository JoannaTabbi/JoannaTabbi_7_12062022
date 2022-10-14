const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const fs = require("fs");

/**
 * displays one post
 */
exports.readOnePost = (req, res, next) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (req.body.imageUrl) {
                post.imageUrl = `${req.protocol}://${req.get("host")}${post.imageUrl}`;
            }
            res.status(200).json(post, hateoasLinks(req, post._id));
        })
        .catch((error) =>
            res.status(404).json({
                error
            })
        );
};

/**
 * displays all the posts
 */
exports.readAllPosts = (req, res, next) => {
    Post.find()
        .then((posts) => {
            posts = posts.map((post) => {
                post.imageUrl = `${req.protocol}://${req.get("host")}${post.imageUrl}`;
                return {
                    ...post._doc
                };
            });
            res.status(200).json(posts);
        })
        .catch((error) =>
            res.status(404).json({
                error
            })
        );
};

/**
 * creates a new post.
 */
 exports.createPost = (req, res, next) => {
    if (!req.body.post && !req.body.image) {
        return res.status(422).json({
            error: "The post is mandatory!"
        });
    };
    const postObject = req.body.post;
    delete postObject._id;
    const post = new Post({
        ...postObject,
        imageUrl: req.file ? `/images/${req.file.filename}` : "",
        userId: req.auth.userId
    });
    post
        .save()
        .then((newPost) =>
            res.status(201).json(newPost, hateoasLinks(req, newPost._id))
        )
        .catch((error) =>
            res.status(400).json(
                error
            )
        );
};

/**
 * Controls one post's likes. The "like" key value equal to 1 gives 
 * a like to the chosen post : the "likes" value is incremented and 
 * the liker's id is added to the userLiked array. 
 * The "like key value equal to 0 removes the like already given : 
 * the "likes" value is decremented and the liker's id is removed from 
 * the usersLiked array. 
 */
exports.likePost = (req, res, next) => {
    Post.findById(req.params.id)
        .then((postFound) => {
            switch (req.body.like) {
                case 1:
                    if (!postFound.usersLiked.includes(req.auth.userId)) {
                        Post.findByIdAndUpdate({
                                _id: req.params.id
                            }, {
                                $inc: {
                                    likes: 1
                                },
                                $push: {
                                    usersLiked: req.auth.userId
                                },
                            }, {
                                new: true,
                                upsert: true,
                                setDefaultsOnInsert: true
                            })
                            .then((postUpdated) =>
                                res
                                .status(200)
                                .json(postUpdated, hateoasLinks(req, postUpdated._id))
                            )
                            .catch((error) =>
                                res.status(400).json({
                                    error
                                })
                            );
                    } else {
                        res.status(200).json({
                            message: "User has already liked this post"
                        });
                    }
                    break;
                case 0:
                    if (postFound.usersLiked.includes(req.auth.userId)) {
                        Post.findByIdAndUpdate({
                                _id: req.params.id
                            }, {
                                $inc: {
                                    likes: -1
                                },
                                $pull: {
                                    usersLiked: req.auth.userId
                                },
                            }, {
                                new: true,
                                upsert: true,
                                setDefaultsOnInsert: true
                            })
                            .then((postUpdated) =>
                                res
                                .status(200)
                                .json(postUpdated, hateoasLinks(req, postUpdated._id))
                            )
                            .catch((error) =>
                                res.status(400).json({
                                    error
                                })
                            );
                    } else {
                        res.status(200).json({
                            message: "User's like is already reset"
                        });
                    }
                    break;
            }
        })
        .catch((error) =>
            res.status(404).json({
                error
            })
        );
};

/**
 * updates a post for an id given.
 */
exports.updatePost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (!post) {
            res.status(404).json({
                error: "No such post !"
            });
        } else if (post.userId !== req.auth.userId) {
            res.status(403).json({
                error: "Unauthorized request!"
            });
        } else {
            const postObject = req.file ? {
                ...JSON.parse(req.body.post),
                imageUrl: `/images/${req.file.filename}`
            } : {
                ...req.body
            };
            const filename = post.imageUrl.split("/images/")[1];
            try {
                if (postObject.imageUrl) {
                    fs.unlinkSync(`images/${filename}`);
                }
            } catch (error) {
                console.log(error);
            }
            Post.findByIdAndUpdate(
                    req.params.id,
                    postObject, {
                        new: true,
                        upsert: true,
                        setDefaultsOnInsert: true
                    })
                .then((postUpdated) =>
                    res.status(200).json(postUpdated, hateoasLinks(req, postUpdated._id))
                )
                .catch((error) =>
                    res.status(400).json({
                        error
                    })
                );
        }
    });
};

/**
 * deletes a post for an id given.
 */
exports.deletePost = (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
        .then((post) => {
            if (!post) {
                return res.status(404).json({
                    error: "No such post !"
                });
            }
            if (post.userId !== req.auth.userId) {
                return res.status(403).json({
                    error: "Unauthorized request!"
                });
            }
            const filename = post.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                Comment.deleteMany({ postId: req.params.id })
                .then(() => res.sendStatus(204))
                .catch((error) => res.status(400).json(error))
            });
        })
        .catch((error) =>
            res.status(500).json({
                error
            })
        );
};

/**
 * Reports a post for an id given. 
 * The id of the user who reports is added to the usersWhoReported array 
 * and the value of reports is increased by 1. No change if the id of the user who reports
 * is already present in the usersWhoReported array.
 */
exports.reportPost = (req, res, next) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (!post.usersWhoReported.includes(req.auth.userId)) {
                Post.findByIdAndUpdate({
                        _id: req.params.id,
                    }, {
                        $inc: {
                            reports: 1
                        },
                        $push: {
                            usersWhoReported: req.auth.userId
                        },
                    }, {
                        new: true,
                        upsert: true,
                        setDefaultsOnInsert: true
                    })
                    .then((postUpdated) =>
                        res
                        .status(200)
                        .json(postUpdated, hateoasLinks(req, postUpdated._id))
                    )
                    .catch((error) =>
                        res.status(400).json({
                            error
                        })
                    );
            } else {
                res.status(200).json({
                    message: "Post already reported"
                });
            }
        })
        .catch((error) => res.status(400).json(error));
};

/**
 * create hateoas links for post
 */
const hateoasLinks = (req, id) => {
    const URI = `${req.protocol}://${req.get("host") + "/api/posts/"}`;
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