# *AVI (name not final)

## Description

News aggregator.

 ## User Stories

 - **404** - Users will see a 404 error page when the view they are trying to access is not found.
 - **500** - Users will see a 500 error page when the server is not able to process a request.
 - **Landing page** - Users will be able to access a landing page where they will see a brief description of the app and links to sign up/log in forms.
 - **Sign up** - Users will be able to sign up to the app.
 - **Log in** - Users will be able to log in to the app so they can acccess the private parts of the app.
 - **Log out** - Users will be able to log out of the app.
 - **See list of headlines** - Users will be able to see a list of headlines according to their interests.
 - **Search for headlines** - Users will be able to search for the headlines they want to see.
 - **Add/remove headlines to favorites** - Users will be able to add and remove headlines to their list of favorite headlines.
 - **Add/remove comments to articles** - Users will be able to post and delete comments for each article.
 - **Share headlines** - Users will be able to share headlines with other users.

## Backlog

- **Find users** - Users will be able to search for and view other users' profiles.
- **Follow/unfollow users** - Users will be able to follow and unfollow users. Users will see headlines favorited by the users they follow in their home page.
- **Message other users** - Users will be able to message other users.


## ROUTES

Method | Route | View | Destination | Private
-- | -- |-- | -- | --
GET | / | index | - | ✘
 | | | | | |
GET | /auth/signup | user/signup | - | ✘
POST | /auth/signup | - | /home |  ✔
GET | /auth/login | user/login | - | ✘
POST | /auth/login | - | /home | ✘
POST | /auth/logout | - | / |  ✔
| | | | | |
GET | /home | user/home | - |  ✔
| | | | | |
GET | /:id/favs | user/home | - |  ✔
POST | /:id/favs | - | /:id/edit |  ✔
| | | | | |
GET | /:id/edit | user/edit | - |  ✔
POST | /:id/edit | - | /:id/edit |  ✔
DELETE | /:id | - | / |  ✔
| | | | | |
GET | /article/:id | user/home | - |  ✔
PUT | /article/:id | - | /article/:id |  ✔
DELETE | /article/:id/commentID | /article/:id | - |  ✔
POST | /article/:id/addfav | - | - |  ✔


## MODELS

```json
"user": {
  "id": "id",
  "name": "String",
  "email": "String",
  "password": "String",
  "country": "String",
  "languages": "Array",
  "articles": "Array",
  "following":"Array",
}
```

```json
"article": {
  "id": "id",
  "source": { "id": null, "name": "Strig"  },
  "author": "String",
  "title": "String",
  "description": "String",
  "url": "String",
  "urlToImage": "String",
  "publishedAt": "String",
  "starred": "Integer",
  "shared": "Integer",
  "comment": [{
    "id": "id",
    "user": "String",
    "text": "String",
    "rating": "Number",
    "likes": "Number",
  }]
}
```

## Links

### Trello

[Trello](https://trello.com/b/Stp6Nmli/project)

### Git

The url to your repository and to your deployed project

[jchaconalvarez/Ironhack-Project2 · GitHub](https://github.com/jchaconalvarez/Ironhack-Project2)

### Slides.com

[https://slides.com/xavifs/deck-2# · Slides](https://slides.com/xavifs/deck-2)
