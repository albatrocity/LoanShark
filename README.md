# [Loan Shark](http://albatrocity.github.io/LoanShark/)
## About
Loan Shark is a simple [Chaplin](http://chaplinjs.org) app for keeping track of things (or money) you loan out to friends. It uses [Exoskeleton](http://exosjs.com), a dependency-less [Backbone](http://backbonejs.org) replacement. Persistence is handled with [PouchDB](http://pouchdb.com) and [backbone-pouch](https://github.com/albatrocity/backbone-pouch) (which unfortunately requires jQuery). Currently the database is device-specific. It's your own localized data.

View a build on [GitHub Pages](http://albatrocity.github.io/LoanShark/)

[Brunch](http://brunch.io) is used for compiling the application and can be used as a server.

## Setup
* clone!
* `npm install -g brunch`
* `npm install`
* `bower install`
* `brunch watch --server`

## Build/Deployment
* edit `app/config.coffeeenv` to set the root in production to whatever directory the app will be running out of.
* run `PRODUCTION=true brunch b --production`
* upload `public` directory to your host at your specified root

## Brunch with Chaplin

[Brunch](http://brunch.io) and [Chaplin](http://chaplinjs.org).
