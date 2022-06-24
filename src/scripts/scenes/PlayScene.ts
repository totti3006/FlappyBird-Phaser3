import IMG_NAME from '../constants/imageName'
import AUDIO from '../constants/audioName'
import Ground from '../objects/Ground/Ground'
import * as setting from '../constants/settings'
import Background from '../objects/Background/Background'
import Bird from '../objects/Bird/Bird'
import Pipes from '../objects/Pipe/Pipes'
import Score from '../objects/Number/Score'

class PlayScene extends Phaser.Scene {
  private ground: Ground
  private background: Background
  private bird: Bird
  private score: Score
  private title: Phaser.GameObjects.Image
  private getReady: Phaser.GameObjects.Image
  private playButton: Phaser.GameObjects.Image
  private pauseButton: Phaser.GameObjects.Image

  private hitSound: Phaser.Sound.BaseSound
  private scoreSound: Phaser.Sound.BaseSound

  private keys: any
  private timerPipe: Phaser.Time.TimerEvent
  private timerScore: Phaser.Time.TimerEvent

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
    this.ground = new Ground(this, this.cameras.main.width / 2 + 24, 456)
    this.bird = new Bird(this, this.cameras.main.width / 3, this.cameras.main.height / 2)
    this.score = new Score(this, 36, this.cameras.main.width / 2, 80)

    this.title = this.add.image(this.cameras.main.width / 2, 80, 'sprite', 'message/message-flappy-bird').setDepth(5)
    this.getReady = this.add
      .image(this.cameras.main.width / 2, 160, 'sprite', 'message/message-get-ready')
      .setDepth(5)
      .setVisible(false)

    this.playButton = this.add
      .image(this.cameras.main.width / 2, 370, 'sprite', 'button/button-playgame')
      .setDepth(5)
      .setInteractive()
      .on('pointerdown', pointer => {
        this.playGame()
      })

    this.pauseButton = this.add
      .image(30, 30, 'sprite', 'button/button-pause')
      .setDepth(5)
      .setVisible(false)
      .setInteractive()
      .on('pointerdown', pointer => {
        this.scene.pause()
        this.scene.launch('PauseScene')
      })

    this.bird.body.setSize(this.bird.width, this.bird.height * 0.9)
    this.physics.add.collider(this.bird, this.ground, this.hitGround)

    this.hitSound = this.sound.add(AUDIO.hit)
    this.scoreSound = this.sound.add(AUDIO.score)

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
  }

  playGame = (): void => {
    this.bird.idle = false
    this.bird.setPlay()

    this.add.existing(this.score)
    this.title.setVisible(false)
    this.getReady.setVisible(true)
    this.playButton.setVisible(false)
    this.pauseButton.setVisible(true)

    this.input.mouse.disableContextMenu()
    this.input.on('pointerdown', pointer => {
      this.bird.jump()
    })

    this.timerPipe = this.time.addEvent({
      delay: 2000,
      callback: this.addPipe,
      callbackScope: this,
      loop: true
    })

    this.time.addEvent({
      delay: 3500,
      callback: this.increaseScoreByTime,
      callbackScope: this,
      loop: false
    })

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.getReady.setVisible(false)
      },
      callbackScope: this,
      loop: false
    })
  }

  increaseScoreByTime = (): void => {
    this.timerScore = this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scoreSound.play()
        this.score.increaseScore()
      },
      callbackScope: this,
      loop: true
    })
  }

  hitGround = (): void => {
    this.physics.pause()

    if (!this.bird.hitPipe) this.setEndGame()

    this.scene.launch('GameOverScene', { playerScore: this.score.getScore() })
    // this.scene.wake('GameOverScene')
  }

  hitPipe = (x, y): void => {
    console.log('hit pipe')
    this.ground.pause()
    this.setEndGame()
    this.bird.hitPipe = true
  }

  setEndGame(): void {
    this.hitSound.play()

    this.bird.anims.pause()
    this.bird.isDeath = true
    this.bird.setTint(0xff6347)

    this.score.setVisible(false)
    this.pauseButton.setVisible(false)
    this.getReady.setVisible(false)

    this.time.removeAllEvents()

    this.input.removeAllListeners()

    this.tweens.getAllTweens().forEach(tween => {
      if (tween.targets) tween.stop()
    })
  }

  addPipe = (): void => {
    let pipes = new Pipes(this)
    let pipeChild = pipes.getAll()
    let collidePipe = this.physics.add.collider(this.bird, pipeChild, (x, y) => {
      this.physics.world.removeCollider(collidePipe)
      this.physics.world.disable(y)
      if (!this.bird.hitPipe) this.hitPipe(x, y)
    }) // x is Bird, y is pipes

    this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.physics.world.removeCollider(collidePipe)
      },
      callbackScope: this,
      loop: false
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
