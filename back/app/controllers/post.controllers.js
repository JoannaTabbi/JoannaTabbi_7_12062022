const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const fs = require("fs");

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

exports.createPost = (req, res, next) => {
    if (!req.body.post) {
        return res.status(422).json({
            error: "The post is mandatory!"
        });
    };
    const post = new Post({
        ...JSON.parse(req.body.post),
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
            Post.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                    postObject,
                    ...req.body,
                    _id: req.params.id
                }, {
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

exports.deletePost = (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
        .then((post) => {
            if (!post) {
                res.status(404).json({
                    error: "No such post !"
                });
            } else if (post.userId !== req.auth.userId) {
                res.status(403).json({
                    error: "Unauthorized request!"
                });
            } else {
                res.status(204).json({});
            }
        })
        .catch((error) =>
            res.status(500).json({
                error
            })
        );
};

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