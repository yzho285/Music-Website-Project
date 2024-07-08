## Setup
In the root directory of the repo, run:
```
# install server dependencies in the root(server) directory
npm install

# install frontend dependencies in the client(Angular) directory
cd client
npm install
```

Or, run `npm run setup` in the root directory which runs a script to execute all the above commands. (Not include setup MongoDB)

## Development
# Option 1: Run both Angular and Express server in two separate terminal so that changes can be update simultaneously

```
# start Angular
cd client
ng serve --open

# go back to the root directory
cd ..

# run the server (nodemon will auto re-run the server when a change is made)
nodemon server.js
```

# Option 2: Only run the Express server, changes will not update simultaneously. Everytime when a change is made to the project, the following commands need to be re-run.

```
# build the Angular app
cd client
npm run build

# go back to the root directory
cd ..

# run the server (nodemon will auto re-run the server when a change is made)
nodemon server.js
```
Or, run `npm run build-run` in the root directory which runs a script to execute all the above commands