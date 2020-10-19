# Computer Parts Store

> An Express.js commerce site split into front and backend. Visit it
> [here](https://packet-loss-store.herokuapp.com/)!

## House Keeping

### Package Management

For this project we are using the [yarn](https://yarnpkg.com/) package
manager. After cloning this project, type `yarn install` to install all
project dependencies.

To install a dependency, type `yarn add $PACKAGE_NAME`. Note: to specify
installation as a development dependency, use the `-D` argument. Eg.
`yarn add -D typescript`.

Alternatively, you can delete the `yarn.lock` file and run `npm install`
with the [npm](https://www.npmjs.com/) package manager.

### Execution

The project can be run by any of the start script specified within the
`package.json`. Each of the scripts will target a different target
MongoDB server for their respective purposes / environment.

### Environment Variables

Please note that in order for the service to perform as expected, you
will need to place a `.env` file in the root folder of this project
containing all the required environment variables. These must be kept
separate from the repository to ensure that no private keys or
information make it onto public source control. To obtain a copy of the
`.env` file to run this project. Please contact on of the contributors
of this project. They can be seen at the bottom of this document.

## Coding Conventions

As we are using TypeScript for this project, we are going to be
following the conventions that have been set out within this
[styleguide](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md).

## Project Structure

This project has been distinctly organised to two different projects,
the client and the server. Each of the files unique to a given sub
project will be located within their respective packages.

Within this project we utilised an MVC data structure to allow better
separation of duty, and a more modular approach to design.

### Server Structure

Within the `server/` package there are 4 main directories of interest:

| Directory     | Explanation                                                                                                                                                                                                                                                                                                                                                                        |
|:--------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `models/`     | The '`models/`' directory is concerned with the model of the MVC. Here we are defining what and how the data is to be indexed and stored within our MongoDB backend.                                                                                                                                                                                                               |
| `controller/` | This '`controller/`' directory is concerned with the controller of the MVC. Here we are concerned about the logic regarding how we manipulate the data and handle edge cases etc.                                                                                                                                                                                                  |
| `middleware/` | This '`middleware/`' directory is concenred with the middleware of the server. Middleware are functions that can be called and run before any respective routing. We utilise the `middleware/` directory to handle authentication on some of our restricted routes.                                                                                                                |
| `routes/`     | This '`routes/`' directory is concerned with the actual routing of the api path endpoints of the MVC. Here we handle the HTTP requests received from the web and parse all of the information. With this extracted information, we can then call the appropriate controller functions to update the data store via the model. These routes will append the base path of `/api/v1/` |

### Client Structure

Within the `client/` package there are 2 main directories of interest.

| Directory | Explanation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|:----------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `views/`  | The '`views/`' directory contains all the webpages to be rendered and sent to the client on a client request. For this project, these front end pages are written using [EJS](https://ejs.co/) as they allow us to dynamically generate the pages to send to the server. The front end of the application acts as the view within the MVC, and the Javascript embedded within the client pages are used to directly interface with the controller written within the backend (server routes). |
| `routes/` | The '`routes/`' directory contains all the routes to listen on the Express server. These routes will append the base path of `/`.                                                                                                                                                                                                                                                                                                                                                             |

### File Structure

```bash
# Client
client/
    views/
        pages/
        partials/
    routes/

# Server
server/ 
    models/
    controller/
    middleware/
    routes/

# All
tests/
public/
```

## Database Schema

To handle the database logic of our application, we have chosen to work
with [MongoDB](https://www.mongodb.com/). For our instance, we have
chosen to use MongoDB Atlas as it allows all developers to share a
common instance of the database. The logic of how we have organised our
schemas should be unaffected if you choose to replicate this project
locally.

MongoDB behaves a bit differently to your typical Database service.
Instead of containing tables of fixed fields, the data is expressed and
stored by a JSON schema. Collections of these instances are known as a
`collection`. A single instance within a collection is known as a
`document`. By following this type of structure, this allows us to be
able to be more creative with how we index and store our data. Where
typical relationship databases cannot store collections of data, we can
define a JSON schema that can. What this means for our schema design is
that we do not need to save cart and order mappings to shop listing
items within a separate table. This is both more efficient and creates a
much simpler design.

For our structure our two main types of data sources are our `User` and
`ShopListing` collections. As this is an online commerce site, there is
naturally going to mappings between documents in these collections. For
our structure, we have chosen to create our mappings via two different
collections named `ShopCart` and `Order`. At a given time a `User` may
only have a single `ShopCart` of items and quantities, however it may
have any number of previous orders. It is critical that the user may not
update any previous orders, or any other users shopping cart. So instead
of providing the `User.id` within the request payload, it is important
to extract the `User.id` from the JWT payload to perform these
operations.

One thing to note, is that our `ShopCart` collection type does not have
the total price attribute. Our reasoning for this, as it is more dynamic
and prevents sync issues as it allows the total price to dynamically
update when the price of an individual `ShopListing` changes price. The
`Order` collection on the other hand will contain a price, as it is a
representation of an instance of a cart payment at a given time. When
the user makes a purchase, the price must never retrospectively change.

![Database Schema](./docs/assets/DbSchema.png)

## Rest API

For the backend of this project we have developed a JSON based REST api.
This api is used natively by the client and is the sole interface for
interfacing with the backend model and data store. Unfortunately due to
time limitations, we were not able to create a full Swaggerhub of
documentation using OpenAPI. However, instead a copy of the
[postman](https://www.postman.com/) requests can be found within
[docs/postman](./docs/postman/postman-queries.json).

## Error Handling

## Server Error Handling

For each route in the routers of the express server, where appropriate
we have implemented a try-catch based approach. Here we are able to
catch any errors that are thrown (as well as throw any errors where an
invalid state was experienced). This approach allows for better
certainty of heuristics, as well as aids in providing a more consistent
and reliable response from the server on situations such as errors.
Given more time, we would have loved to have documented the error
responses of the site using OpenAPI + Swaggerhub.

To assist with error handling of the server, 100% of the code is written
using [TypeScript](https://www.typescriptlang.org/). TypeScript is an
extension of the Javascript language that adds strongly typed types.
Using TypeScript we can verify that our variables and responses comply
with the specified format and do not change into invalid states. This by
nature, greatly increases the certainty of the software (reduces number
of bugs).

Additionally, if the server ends up in a bad state where it is stuck
attempting to serve the client for too long. We are using an extra
middleware called
[connect-timeout](https://www.npmjs.com/package/connect-timeout). Using
this middleware we are able to set a hard timeout of 10s to serve a
given connection. This value can easily be changed and tweaked as the
site and needs change over time.

## Client Error Handling

The client also manages a small amount of error checking. These errors
are blatantly obvious and do not need server confirmation. Examples of
this might be adding a negative number of items to a cart, or
confirmation passwords that do not match. These pre-condition checks are
performed client side to reduce the total workload on the server. Any
errors that become apparent to the client (from both server response and
local pre-checks) are reflected to the user via error cards to notify
them of why their input was invalid. Accompanying these error cards,
success cards are also present to notify the user of successful actions
to the server. This also ensures that the client actions and server do
not get out of sync.

## Testing

Testing for this project is implemented using
[Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/). To run
the tests execute `yarn run test`.

## Authors

| [![Zac Scott](https://gitlab.ecs.vuw.ac.nz/uploads/-/system/user/avatar/1422/avatar.png)](https://gitlab.ecs.vuw.ac.nz/scottzach1) | [![Harrison Cook](https://gitlab.ecs.vuw.ac.nz/uploads/-/system/user/avatar/1476/avatar.png)](https://gitlab.ecs.vuw.ac.nz/cookharr) | [![Jeffrey Tong](https://secure.gravatar.com/avatar/51cde15ab7b44e147b07c62c7516b984?s=180&d=identicon)](https://gitlab.ecs.vuw.ac.nz/tonghoh) |
|:-----------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| [Zac Scott](https://gitlab.ecs.vuw.ac.nz/scottzach1)                                                                               | [Harrison Cook](https://gitlab.ecs.vuw.ac.nz/cookharr)                                                                               | [Jeffrey Tong](https://gitlab.ecs.vuw.ac.nz/tonghoh)                                                                                           |
| 300447976                                                                                                                          | 300402048                                                                                                                            | 300417799                                                                                                                                      |
