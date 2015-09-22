# 67-475 Team 17 F15
## Cycle 2 Project
### Steps to Set Up 
1. Setup Postgres locally
2. Login using the superuser account and paste this code in to create the development/test user for this app: `create role cycle2 wth createdb login password 'secret';`
3. Git clone this project.
4. CD into `/web`
5. run `bundle`
6. run `rake db:setup`
7. run `rake db:migrate`
## Steps to Run
1. While in `/web`, run `rails server`
2. Open a new terminal
3. cd into `/mobile`
4. run `ionic serve`

Rails (default port 3000) and Ionic (default port 8100) are now both running locally.

*__Note__: The starter code for this project was taken from an open source example. The original README text from that example is preserved below.*

---

Welcome to the Part Two of Rails and Ionic Make Love, by Dovetail Digital.

You can view the original blog post here:
http://www.dovetaildigital.io/blog/2015/8/26/rails-and-ionic-make-love-part-two

Feel like a chat? We're kicking rocks over at @dovetaildigital, and would love to hear from you.
