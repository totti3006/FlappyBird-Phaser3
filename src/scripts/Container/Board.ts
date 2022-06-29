import Score from '../objects/Number/Score'

class Board extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, playerScore: number) {
    super(scene)

    scene.add.existing(this)

    let board = scene.add.image(0, 0, 'sprite', 'message/board')
    let newHighScore = scene.add.image(35, 8, 'sprite', 'message/message-new').setVisible(false)

    this.add(board)
      .add(newHighScore)
      .setPosition(scene.cameras.main.width / 2, scene.cameras.main.height / 2)

    let medal: Phaser.GameObjects.Image

    if (playerScore >= 10 && playerScore < 20) {
      medal = scene.add.image(-66, 8, 'sprite', 'medal/gold-medal-1')
      this.add(medal)
    }
    if (playerScore >= 20 && playerScore < 30) {
      medal = scene.add.image(-66, 8, 'sprite', 'medal/silver-medal')
      this.add(medal)
    }
    if (playerScore >= 30 && playerScore < 40) {
      medal = scene.add.image(-66, 8, 'sprite', 'medal/silver-medal-1')
      this.add(medal)
    }
    if (playerScore >= 40) {
      medal = scene.add.image(-66, 8, 'sprite', 'medal/gold-medal-0')
      this.add(medal)
    }
  }
}

export default Board
