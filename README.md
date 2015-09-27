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

Show all uploads: `localhost:3000/home.json`

Show current users uploads: `localhost:3000/uploads.json`

Add upload: `localhost:3000/uploads.json`

``

*__Note__: The starter code for this project was taken from an open source example. The original README text from that example is preserved below.*



---



You can view the original starter blog post here:
http://www.dovetaildigital.io/blog/2015/8/26/rails-and-ionic-make-love-part-two
