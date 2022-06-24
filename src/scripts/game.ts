import 'phaser'
import { HEIGHT, WIDTH } from './constants/settings'
import GameOverScene from './scenes/GameOverScene'
import LoadingScene from './scenes/LoadingScene'
import PauseScene from './scenes/PauseScene'
import PlayScene from './scenes/PlayScene'

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT
  },
  scene: [LoadingScene, PlayScene, PauseScene, GameOverScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
