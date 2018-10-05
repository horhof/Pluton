import { getLog } from './Logger'
const debug = getLog(`Game`)
debug

import { Game } from './Game';

const game = new Game()
game.start()
