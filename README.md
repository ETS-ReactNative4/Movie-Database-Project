# Movie Store Project
I worked on this for a project course in data and web applications, and taught myself React and React native while doing it.
It turned out to be a lot of work! Tomcat and React don't seem to work very well together, but the project was completed nonetheless. 
Here's a list of the many different things I had to implement in this project:
* Design a relational database that holds movies, stars, genres, customers, and sales.
* Create multiple Java servlets that serve as endpoints for getting data related to searching, logging in, and purchasing.
* Display movie information as cards, organize said cards by genre, rating, or starting letter.
* Make all movies fully searchable, either by title, director, genre, year, or stars.
* Create an automatic search bar that would cache search results locally in session history, so as not to overload the server.
* Secured the login information by encrypting the passwords and adding Re-Captcha verification.
* Verified SSL certificate using LetsEncrypt, mostly to allow mobile app to connect as React Native doesn't play well with self signed
* Enabled logged in customers to "purchase" items by clicking plus on movie cards and then visiting the checkout page, verified information for customer as well, pre-filling some of their billing information
* Deployed React Native app using Expo, worked on both Android and iOS.
