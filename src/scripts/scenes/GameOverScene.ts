import AnimatedButton from '../animations/AnimatedButton'
import Board from '../Container/Board'
import Score from '../objects/Number/Score'

class GameOverScene extends Phaser.Scene {
  private gameOver: Phaser.GameObjects.Image
  private playButton: AnimatedButton

  private scoreBoard: Board
  private playerStore: number = 0

  private score: Score
  private highScore: Score

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

    this.score = new Score(this, 20, this.cameras.main.width - 60, this.cameras.main.height / 2 - 15)

    this.highScore = new Score(this, 20, this.cameras.main.width - 60, this.cameras.main.height / 2 + 27)

    this.tweens.add({
      targets: this.scoreBoard,
      props: {
        alpha: 1
      },
      duration: 300,
      repeat: false
    })

    this.handleScore(this.playerStore)

    this.playButton = new AnimatedButton(this, this.cameras.main.width / 2, 370, 'sprite', 'button/button-playgame')
    this.playButton
      .initButton(this.handleClickPlay)
      .setDepth(5)
      .setInteractive()
      .setVisible(false)
      .once('pointerup', pointer => {
        this.playButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.playButton.playPointerMove()
      })

    this.time.delayedCall(500, () => {
      this.playButton.setVisible(true)
    })

    this.addInput()
  }

  private handleClickPlay = (): void => {
    this.cameras.main.fadeOut(250, 0, 0, 0)
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
    this.score.setScore(this.playerStore)

    if (localStorage.getItem('highScore') === null) {
      this.saveHighScore(score)
    } else {
      if (score > this.getHighScore()) {
        this.saveHighScore(score)
      } else {
        this.highScore.setScore(this.getHighScore())
      }
    }
  }

  saveHighScore(score: number): void {
    localStorage.setItem('highScore', score.toString())

    this.highScore.setScore(score)

    let newHighScore = this.scoreBoard.getAt(1) as Phaser.GameObjects.Image
    newHighScore.setVisible(true)
  }

  getHighScore(): number {
    return Number(localStorage.getItem('highScore'))
  }
}

export default GameOverScene
