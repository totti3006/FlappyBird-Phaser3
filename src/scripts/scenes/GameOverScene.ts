import Score from '../objects/Number/Score'

class GameOverScene extends Phaser.Scene {
  private gameOver: Phaser.GameObjects.Image
  private board: Phaser.GameObjects.Image
  private playButton: Phaser.GameObjects.Image
  private newHighScore: Phaser.GameObjects.Image
  private score: Score
  private highScore: Score

  private keys: any

  constructor() {
    super({
      key: 'GameOverScene'
    })
  }

  create(data): void {
    this.gameOver = this.add.image(this.cameras.main.width / 2, 160, 'sprite', 'message/message-game-over')
    this.board = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'sprite', 'message/board')
    this.newHighScore = this.add
      .image(this.cameras.main.width / 2 + 35, this.cameras.main.height / 2 + 8, 'sprite', 'message/message-new')
      .setVisible(false)

    this.score = new Score(this, 20, this.cameras.main.width - 65, this.cameras.main.height / 2 - 15)
    this.highScore = new Score(this, 20, this.cameras.main.width - 65, this.cameras.main.height / 2 + 27)

    this.score.setScore(data.playerScore)

    if (data.playerScore > this.highScore.getScore()) {
      this.highScore.setScore(data.playerScore)
      this.saveHighScore(this.highScore.getScore())
      this.newHighScore.setVisible(true)
    } else {
      this.highScore.setScore(this.getHighScore())
    }

    this.add.existing(this.score)
    this.add.existing(this.highScore)

    this.playButton = this.add
      .image(this.cameras.main.width / 2, 370, 'sprite', 'button/button-playgame')
      .setDepth(5)
      .setInteractive()
      .on('pointerdown', pointer => {
        this.scene.start('PlayScene')
      })

    this.keys = this.input.keyboard.addKey('Enter')
    this.keys.on('down', () => {
      this.scene.start('PlayScene')
    })
  }

  saveHighScore(score: number): void {
    localStorage.setItem('highScore', score.toString())
  }

  getHighScore(): number {
    return Number(localStorage.getItem('highScore'))
  }
}

export default GameOverScene
