## GROUPOMANIA SOCIAL NETWORK

Groupomania is a modern internal social network which will allow employees to get to know each other and exchange in a more informal context.
This project is created as part of the Web Development vocational training by OpenClassrooms. It particularly aimes to authenticate the user and maintain his session, implement securised database and develop a website interface with a front-end framework, which is Vue.js. 


## REQUIREMENTS

Node.js, version: 16.15.1 LTS or later  
npm version 8.19.3 or later 


## GETTING STARTED

Clone this repository and open it in your code editor. Move to the back directory, run *npm install* then *nodemon server*, the server will run on port 3000 (default).  
Create .env file in the back directory, then copy/paste the content of the .env.exemple file. Set your own values to the environment variables that it contains.


## DATABASE

The API works with MongoDB NoSQL database : If needed, sign up as indicated on the [MongoDB](https://www.mongodb.com/cloud/atlas/register) website and get your SRV address. Paste it to the MONGO_URI value in .env file in order to connect to the database: don't forget to replace PASSWORD by your own one. 


## USE

You can test this API with an API client, like POSTMAN or Thunder client which is the VSCode extension. When logged, copy the token given in the response and paste it to a dedicated authorization field.

## DOCUMENTATION

You'll find below the routes that you can test with an API client. Note that the responses contain the HATEOAS links that allow you to directly reach the object related routes.
The *create*, *like*, *follow*, *unfollow* routes are available to any authenticated user. 
The *report* routes are available to any non admin user.
The *readOneself*, *exportData* and all *update* and *delete* routes are not available to the user who didn't create this data.
Finally, for moderation purposes, admin user can modify or delete any post or comment content.  

### USER

|name   |method   |URI   |description   |
|:---|:---|:---|:---|
|signup   |POST  |/api/auth/   |register new user   |
|login   |POST  |/api/auth/   |opens securised session for a user. An access token is given in the response and the refresh token stored in cookies.  |
|logout   |DELETE |/api/auth/   |close the user's session, the refresh token is deleted   |
|readUser   |GET   |/api/auth/:id   |returns one user's data. The following information is available to any authenticated user : userName, aboutMe, avatar, posts, following, followers, likes and comments. |
|readOneself   |GET   |/api/auth/   |returns user's own data   |
|exportData   |GET   |/api/auth/export/   |prints user's data to a txt document   |
|updateUser   |PUT   |/api/auth/   |updates user's data   |
|deleteUser   |DELETE   |/api/auth/   |deletes all user's data   |
|follow   |PATCH  |/api/auth/:id/follow   |allows the authenticated user to follow another user (whose id is given in params). The id of the follower user is added to the followed *followers* array and vice versa : the id of the followed user is added to the follower *following* array    |
|unfollow  |PATCH  |/api/auth/:id/unfollow   |removes the follower id from the followed user *followers* array. The id of the followed user is removed from the follower *following* array   |
|reportUser   |POST   |/api/auth/:id/report/   |reports abusive content for a user id given in params.   |

### POST

|name   |method   |URI   |description   |
|:---|:---|:---|:---|
|readOnePost   |GET   |/api/posts/:id   |displays one post   |
|readAllPosts  |GET   |/api/posts/   |displays all the posts   |
|readUserPosts  |POST   |/api/posts/userPosts   |displays the posts of one user   |
|createPost   |POST   |/api/posts/   |creates a new post   |
|likePost   |POST  |/api/posts/:id/like   |controls one post's likes. The "like" key value equal to 1 gives a like to the chosen post, equal to 0 removes the like already given.    |
|updatePost   |PUT   |/api/posts/:id   |updates one post   |
|deletePost   |DELETE   |/api/posts/:id   |deletes one post   |
|reportPost   |POST   |/api/posts/:id/report/   |reports abusive content for a post id given.  | 

### COMMENT

The comment routes are available for a post id given.

|name   |method   |URI   |description   |
|:---|:---|:---|:---|
|readOneComment   |GET   |/api/comments/:id   |displays one comment   |
|readAllComments  |GET   |/api/comments/  |displays all the comments for a postId given.  |
|createComment   |POST   |/api/comments/   |creates a new comment for a post given. The new comment id is pushed to post's "comments" array.   |
|likeComment   |POST  |/api/comments/:id/like   |controls one comment likes. The "like" key value equal to 1 gives a like to the chosen comment, equal to 0 removes the like already given.    |
|updateComment   |PUT   |/api/comments/:id   |updates one comment   |
|deleteComment   |DELETE   |/api/comments/:id   |deletes one comment; the id of the deleted comment is removed from the post's "comments" array.  |
|reportComment   |POST   |/api/comments/:id/report/   |reports abusive content for a comment id given.  | 

## FRONT-END


### Project setup
Created using the @vue/cli 5.0.6.     
Move to the front directory, run  
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
The server will run on port 8080 (default).  
Create .env.local file in the front directory, then copy/paste the content of the .env file. Set your own values.  


### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).