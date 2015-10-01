# 67-475 Team 17 F15
## Cycle 2 Project
### Steps to Set Up 
1. Setup Postgres locally
2. Login using the superuser account and paste this code in to create the development/test user for this app: `create role cycle2 with createdb login password 'secret';`
3. Git clone this project.
4. CD into `/web`
5. run `bundle`
6. run `rake db:create` to create the database
7. run `rake db:migrate` to create the tables
8. install imagemagick from a binary distribution, or, if on a Mac, run `sudo brew install imagemagick`

## Steps to Run
1. While in `/web`, run `rails server`
2. Open a new terminal
3. cd into `/mobile`
4. run `ionic serve --lab` (`ionic emulate ios` is also available if on a Mac)

Rails (default port 3000) and Ionic (default port 8100) are now both running locally.


## Database Details

There are 4 tables: User, Upload, Favorite, and Purchase. A User can have many Uploads (each is one of their own photos). A User can have many Favorites (joins User and Upload) and can make many Purchases (also joins User and Upload).

Uploads (photos) are purchased one at a time (i.e., there is no cart).

There are currently 4 API endpoints, which respond to the typical RESTful actions: Uploads, Favorites, and Purchases, which respond like:

Hitting any Upload, Favorite, or Purchase endpoint requires **user_email** and **user_token** for figuring out who the current_user is. An error is thrown if the given email/token do not match.


## API Examples

All endpoints should be working. The following examples use a created user_email = **testuser@aol.com** that was given a user_token = **wUdznDo5WJuTMshpJZeo**. Authorization uses data: `{user_email: STRING, user_token: STRING}`

For example: 

*To show the current user's uploads, which is a GET request, from terminal*: `curl -H 'Content-Type: application/json' -H 'Accept: application/json' -X GET 'http://localhost:3000/uploads?user_email=test@aol.com&user_token=wUdznDo5WJuTMshpJZeo'`

*To upload photo, which is a POST request*: `curl -H 'Content-Type: application/json' -H 'Accept: application/json' -X POST 'http://localhost:3000/uploads' -d "{\"user_email\":\"test@aol.com\",\"user_token\":\"wUdznDo5WJuTMshpJZeo\",\"upload\":{\"photos\":[\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAKGyMeGBohmJyb...\"],\"tags\":\"\",\"location\":\"\", \"copyright\":\"0\"}}"`

*Get favorites*: `curl -H 'Content-Type: application/json' -H 'Accept: application/json' -X GET 'http://localhost:3000/favorites?user_email=test@aol.com&user_token=wUdznDo5WJuTMshpJZeo'`

*Favorite upload with id of 8*: `curl -H 'Content-Type: application/json' -H 'Accept: application/json' -X POST 'http://localhost:3000/favorites/8' -d "{\"user_email\":\"test@aol.com\",\"user_token\":\"wUdznDo5WJuTMshpJZeo\"}"`

The rest of the endpoints are described briefly below.

#### Foursquare

1. Get foursquare locations manually, by LAT and LONG: `GET /four_square`, data: `{four_square: {query: STRING, lat: FLOAT, long, FLOAT}}`
2. Get foursquare locations for a saved upload: `GET /four_square/:id`, (optional) data: `{four_square: {query}}`

`:id` is the id of a saved upload object.
*query* is a string to be matched against nearby results.

#### Uploads

1. (Auth needed) Get all of the logged-in user's uploads: `GET /myphotos`
2. (Auth needed) Create: `POST /uploads`, data: `{upload: {location: STRING, tags: STRING, copyright: INTEGER, photo: PHOTO, photos: [PHOTOS_ARRAY])}`
3. (Auth needed) Update: `PATCH /uploads/:id`, data: `{upload: {location: STRING, tags: STRING, copyright: INTEGER)}`
4. Get any one upload: `GET /uploads/:id`
5. (Auth needed) Delete: `DELETE /uploads/:id`
6. Get all uploads `GET /uploads`

Again, `:id` is the id of a saved upload object. `copyright` of 0 means 'free-to-use', while a copyright of 1 means 'proprietary'. `location` is optional and, theoretically, the name of a foursquare location that was selected from a dropdown by the user. `tags` is just an optional comma-separated text to be used for searching.
**Note**: There is a `photos` attribute for `uploads` to allow for simultaneous multiple upload of photos. When uploading photos, if `photos` exists and is an array of multiple photos, each photo will became its own Upload object, but all the Uploads will share the same location, tags, and copyright values. For simple single upload, an array of 1 value in `photos` works, or `photo` works.

#### Favorites

1. (Auth needed) Get all of logged-in user's favorites: `GET /favorites`
2. (Auth needed) Add a favorite for the logged-in user: `POST /favorites/:id`
3. (Auth needed) Unfavorite: `DELETE /favorites/:id`

Again, `:id` is the id of an upload object.

#### Purchases

1. (Auth needed) Get all of logged-in user's purchases: `get /purchases`
2. (Auth needed) Add a purchase for the logged-in user: `POST /purchases/:id`

Again, `:id` is the id of an upload object.

## Other Notes

The starter code for this project was taken from an open source example. You can view the original starter blog post here:
http://www.dovetaildigital.io/blog/2015/8/26/rails-and-ionic-make-love-part-two
