import Board from '../Container/Board'
import Score from '../objects/Number/Score'

class GameOverScene extends Phaser.Scene {
  private gameOver: Phaser.GameObjects.Image
  private playButton: Phaser.GameObjects.Image

  private scoreBoard: Board
  private playerStore: number = 0

  private keys: any

  constructor() {
    super({
      key: 'GameOverScene'
    })
  }

  create(data): void {
    this.playerStore = data.playerScore

    this.gameOver = this.add.image(this.cameras.main.width / 2, 160, 'sprite', 'message/message-game-over')

    this.scoreBoard = new Board(this, this.playerStore)
    this.scoreBoard.setAlpha(0)

    this.tweens.add({
      targets: this.scoreBoard,
      props: {
        alpha: 1
      },
      duration: 300,
      repeat: false
    })

    this.handleScore(this.playerStore)

    this.playButton = this.add
      .image(this.cameras.main.width / 2, 370, 'sprite', 'button/button-playgame')
      .setDepth(5)
      .setInteractive()
      .setVisible(false)
      .on('pointerup', pointer => {
        this.cameras.main.fadeOut(250, 0, 0, 0)
      })
      .on('pointermove', pointer => {
        this.playButton.setScale(1.05, 1.05).setTint(0xdcdcdc)
      })
      .on('pointerout', pointer => {
        this.playButton.setScale(1, 1).clearTint()
      })

    this.time.delayedCall(500, () => {
      this.playButton.setVisible(true)
    })

    this.addInput()
  }

  addInput(): void {
    this.keys = this.input.keyboard.addKey('Enter')
    this.time.delayedCall(500, () => {
      this.keys.on('down', () => {
        this.cameras.main.fadeOut(250, 0, 0, 0)
      })
    })

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
      this.time.delayedCall(200, () => {
        this.scene.start('PlayScene')
      })
    })
  }

  handleScore(score: number): void {
    let scoreObj = this.scoreBoard.getAt(2) as Score
    scoreObj.setScore(score)

    if (localStorage.getItem('highScore') === null) {
      this.saveHighScore(score)
    } else {
      if (score > this.getHighScore()) {
        this.saveHighScore(score)
      } else {
        let highScore = this.scoreBoard.getAt(3) as Score
        highScore.setScore(this.getHighScore())
      }
    }
  }

  saveHighScore(score: number): void {
    localStorage.setItem('highScore', score.toString())

    let highScore = this.scoreBoard.getAt(3) as Score
    highScore.setScore(score)

    let newHighScore = this.scoreBoard.getAt(1) as Phaser.GameObjects.Image
    newHighScore.setVisible(true)
  }

  getHighScore(): number {
    return Number(localStorage.getItem('highScore'))
  }
}

export default GameOverScene
