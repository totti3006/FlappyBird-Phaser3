import IMG_NAME from '../constants/imageName'
import AUDIO from '../constants/audioName'
import Ground from '../objects/Ground/Ground'
import Background from '../objects/Background/Background'
import Bird from '../objects/Bird/Bird'
import PipeGenerator from '../objects/Pipe/PipeGenerator'
import Score from '../objects/Number/Score'
import ScreenContainer from '../Container/ScreenContainer'
import * as setting from '../constants/settings'

class PlayScene extends Phaser.Scene {
  private ground: Ground
  private background: Background
  private bird: Bird
  private score: Score

  private screenContainer: ScreenContainer

  private hitSound: Phaser.Sound.BaseSound

  private keys: any

  private pipeGen: PipeGenerator

  constructor() {
    super({ key: 'PlayScene' })
  }

  preload(): void {
    this.load.image(IMG_NAME.background, 'assets/img/bg_day.png')

    this.load.atlas('sprite', 'assets/img/flappy-bird-sprite.png', 'assets/img/flappy-bird-sprite.json')

    this.load.audio(AUDIO.flap, 'assets/sound/audios_flappy.mp3')
    this.load.audio(AUDIO.hit, 'assets/sound/audios_collision.mp3')
    this.load.audio(AUDIO.score, 'assets/sound/audios_score.mp3')
  }

  create(): void {
    this.background = new Background(this, this.cameras.main.width / 2, this.cameras.main.height / 2)
    this.ground = new Ground(this)
    this.bird = new Bird(this, this.cameras.main.width / 3, this.cameras.main.height / 2)
    this.score = new Score(this, 36, this.cameras.main.width / 2, 80)

    this.pipeGen = new PipeGenerator(this, this.bird, this.score, this.hitPipe)

    this.screenContainer = new ScreenContainer(this, this.playGame, this.switchToPause)

    this.bird.body.setSize(this.bird.width * 0.9, this.bird.height * 0.9)
    this.physics.add.collider(this.bird, this.ground, this.hitGround)

    this.hitSound = this.sound.add(AUDIO.hit)

    this.addInput()

    this.cameras.main.fadeIn(250, 0, 0, 0)
  }

  playGame = (): void => {
    this.time.delayedCall(2000, () => {
      this.pipeGen.start()
    })

    this.bird.idle = false
    this.bird.setPlay()

    this.add.existing(this.score)

    this.screenContainer.startGame()
  }

  addInput(): void {
    this.keys = this.input.keyboard.addKey('Space')
    this.keys.on('down', () => {
      if (!this.bird.isDeath) {
        if (this.bird.idle) {
          this.playGame()
        } else {
          this.bird.jump()
        }
      }
    })

    this.input.mouse.disableContextMenu()
    this.input.on('pointerdown', pointer => {
      if (!this.bird.idle) {
        this.bird.jump()
      }
    })
  }

  switchToPause = (): void => {
    this.scene.pause()
    this.scene.launch('PauseScene')
  }

  hitGround = (): void => {
    this.physics.pause()

    if (!this.bird.hitPipe) this.setEndGame()

    this.bird.setDie()

    this.time.delayedCall(1000, () => {
      this.scene.launch('GameOverScene', { playerScore: this.score.getScore() })
    })
  }

  hitPipe = (x, y): void => {
    this.ground.pause()
    this.setEndGame()
    this.bird.hitPipe = true
  }

  setEndGame(): void {
    this.hitSound.play()

    this.cameras.main.flash()

    this.pipeGen.stop()

    this.bird.anims.pause()
    this.bird.isDeath = true

    this.score.setVisible(false)

    this.screenContainer.endGame()

    this.time.removeAllEvents()

    this.input.removeAllListeners()

    this.tweens.getAllTweens().forEach(tween => {
      if (tween.targets) tween.stop()
    })
  }

  update(time: number, delta: number): void {
    super.update(time, delta)

    if (!this.bird.isDeath) {
      this.background.tilePositionX += 0.5
      this.ground.update()
    }
  }
}

export default PlayScene
