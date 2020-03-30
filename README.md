![pm3](https://user-images.githubusercontent.com/34702996/77866706-1e2d2e80-7202-11ea-9044-f3af32ea78cc.jpg)

# PAC-MAN BATTLE ROYALE 

Pac-Man is a maze chase online video game to be played by minimum two players and maximum four players.

## Game Rules

1) Player-1 creates the game room and shares the game code with minimum 1 player and maximum 3 more players and initiates the game.
2) Each player playing as a Pac-Man munches his way around the maze, eating the small Pac dots, Power Pellets and food.
3) There are some scattered Power Pellets which when the Pac-Man eats, turns into a big Pac-Man for 10 seconds.
4) Big Pac-Man can eat other small Pac-Man and ghosts.
5) Once a small Pac-Man gets big, 1 ghost is released and turns weak changing its color to blue.
6) Speed of the big Pac-Man is more than the small Pac-Man and the ghosts.
7) The big Pac-Man starts flashing two seconds prior to changing back to small version.
8) When more than one Pac-Man turns big, all the big Pac Men simultaneously return to their small version 10 seconds after the first Pac-Man eats the Power Pellet.
9) When the same size Pac-Man collides, they bounce off each other in opposite direction.
10) Small Pac-Man leaves the round when it lands on a big Pac-man or a ghost.
11) Ghost turns into a pair of eyes and returns to its cage when eaten by a big Pac-Man.
12) When the Pac-Man eats all the food, the whole maze is renewed with food, dots and Power Pellet.
13) In each round, level winner is announced to the last Pac-Man who survives in the level and is awarded a score of 1 point.
14) The player who collects the highest score after all the rounds is declared the Winner of the game!





# Phaser 3 Webpack Project Template

A Phaser 3 project template with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds.

Loading images via JavaScript module `import` is also supported.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.


After starting the development server with `npm start`, you can edit any files in the `src` folder
and webpack will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

## Customizing Template

### Babel
You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

  ```
  "browsers": [
    ">0.25%",
    "not ie 11",
    "not op_mini all"
  ]
  ```

### Webpack
If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can
modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create
new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code
After you run the `npm run build` command, your code will be built into a single bundle located at 
`dist/bundle.min.js` along with any other assets you project depended. 

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`), 
you should be able to open `http://mycoolserver.com/index.html` and play your game.
