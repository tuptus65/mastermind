import { Game } from './game.js'

const canvas = document.getElementById('mastermind')
const game = new Game(canvas)
window.game = game
game.run()