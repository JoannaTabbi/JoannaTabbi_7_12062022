const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const fs = require("fs");

/**
 * displays one post
 */
exports.readOnePost = (req, res, next) => {
    Post.findById(req.params.id)
        .populate([{
                path: "userId",
                select: ["userName", "imageUrl"]
            },
            {
                path: "usersLiked",
                select: ["userName", "imageUrl"]
            },
            {
                path: "comments "
            }
        ])
        .then((post) => {
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
exports.readAllPosts = async (req, res, next) => {

    //destructure page and limit with the default value
    const {
        page = 1, limit = 10
    } = req.query;

    try {

        //execute query with page and limit values, documents sorted from newest to oldest,
        //populated for userId, usersLiked and comments
        const posts = await Post.find()
            .populate([{
                    path: "userId",
                    select: ["userName", "imageUrl"]
                },
                {
                    path: "usersLiked",
                    select: ["userName", "imageUrl"]
                },
                {
                    path: "comments",
                    populate: {
                        path: "userId",
                        select: ["userName", "imageUrl"]
                    }
                }
            ])
            .sort({
                updatedAt: -1
            })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        // get total documents in Post collection
        const count = await Post.countDocuments()

        // return response with posts, total of pages and current page
        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });

    } catch (err) {
        res.status(404).json({
            error
        })
    }
};

/**
 * gets all the posts of one user.
 */
exports.readUserPosts = async (req, res, next) => {

    //destructure page and limit with the default value
    const {
        page = 1, limit = 10
    } = req.query;

    //execute query with page and limit values, documents sorted from newest to oldest,
    //populated for userId, usersLiked and comments
    try {
        const userPosts = await Post.find({
                userId: req.body.postUser
            })
            .populate([{
                    path: "userId",
                    select: ["userName", "imageUrl"]
                },
                {
                    path: "usersLiked",
                    select: ["userName", "imageUrl"]
                },
                {
                    path: "comments",
                    populate: {
                        path: "userId",
                        select: ["userName", "imageUrl"]
                    }
                }
            ])
            .sort({
                updatedAt: -1
            })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        // get total documents in Post collection
        const count = await Post.countDocuments({
            userId: req.body.userId
        })

        res.status(200).json({
            userPosts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        })

    } catch (err) {
        res.status(404).json({
            error
        })
    }

}


/**
 * creates a new post.
 */
exports.createPost = (req, res, next) => {
    console.log(req.body);
    if (!req.body.message && !req.file) {
        return res.status(422).json({
            error: "The post is mandatory!"
        });
    };

    const post = new Post({
        ...req.body,
        imageUrl: req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : "",
        userId: req.auth.userId
    });
    post
        .save()
        .then(() => {
            Post.populate(post, {
                    path: "userId",
                    select: ["userName", "imageUrl"]
                })
                .then((newPost) => {
                    res.status(201).json(newPost, hateoasLinks(req, newPost._id))
                })
                .catch((error) =>
                    res.status(400).json(
                        error
                    ))
        })
        .catch((error) =>
            res.status(400).json(
                error
            ))

};

/**
 * Controls one post's likes. The "like" key value equal to false gives 
 * a like to the chosen post : the "likes" value is incremented and 
 * the liker's id is added to the userLiked array. 
 * The "like key value equal to true removes the like already given : 
 * the "likes" value is decremented and the liker's id is removed from 
 * the usersLiked array. 
 */
exports.likePost = (req, res, next) => {
    Post.findById(req.params.id)
        .then((postFound) => {
            switch (req.body.like) {
                case true:
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
                            .populate({
                                path: "usersLiked",
                                select: ["userName", "imageUrl"]
                            })
                            .then((postUpdated) => {
                                res
                                    .status(200)
                                    .json(postUpdated, hateoasLinks(req, postUpdated._id))
                            })
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
                case false:
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
                            .populate({
                                path: "usersLiked",
                                select: ["userName", "imageUrl"]
                            })
                            .then((postUpdated) => {
                                res
                                    .status(200)
                                    .json(postUpdated, hateoasLinks(req, postUpdated._id))
                            })
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
            return res.status(404).json({
                error: "No such post !"
            })
        }
        if ((post.userId != req.auth.userId) && req.auth.isAdmin === false) {
            return res.status(401).json({
                error: "Unauthorized request!"
            });
        }
        const postObject = req.file ? {
            ...req.body,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
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
            .then((postUpdated) => {
                res.status(200).json(postUpdated, hateoasLinks(req, postUpdated._id))
            })
            .catch((error) =>
                res.status(400).json({
                    error
                })
            );

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
            };
            if (post.userId != req.auth.userId && req.auth.isAdmin == false) {
                return res.status(401).json({
                    error: "Unauthorized request"
                });
            };
            if (post.imageUrl) {
                const filename = post.imageUrl.split("/images/")[1];
                fs.unlinkSync(`images/${filename}`)
            };
            /*Comment.deleteMany({
                    postId: req.params.id
                }) 
                .then(() => res.sendStatus(204))
                .catch((error) => res.status(400).json(error)) */

            res.sendStatus(204);
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