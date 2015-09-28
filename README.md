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

*Show all uploads*: `GET localhost:3000/home.json`

The following examples use a created user_email = **testuser@aol.com** that was given a user_token = **wUdznDo5WJuTMshpJZeo**:

*To show the current user's uploads (from terminal), which is a GET request*: `curl -H 'Content-Type: application/json' -H 'Accept: application/json' -X GET 'http://localhost:3000/uploads?user_email=test@aol.com&user_token=wUdznDo5WJuTMshpJZeo'`

*To upload photo from terminal, which is a POST request*: `curl -H 'Content-Type: application/json' -H 'Accept: application/json' -X POST 'http://localhost:3000/uploads' -d "{\"user_email\":\"test@aol.com\",\"user_token\":\"wUdznDo5WJuTMshpJZeo\",\"upload\":{\"photos\":[\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAKGyMeGBohmJyb...\"],\"tags\":\"\",\"location\":\"\", \"copyright\":\"0\"}}"`


# Other Notes

The starter code for this project was taken from an open source example. You can view the original starter blog post here:
http://www.dovetaildigital.io/blog/2015/8/26/rails-and-ionic-make-love-part-two
