class ScreenContainer extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, playGame, switchToPause) {
    super(scene)

    scene.add.existing(this)

    ///////////////
    // title label
    ///////////////
    let title = scene.add.image(scene.cameras.main.width / 2, 80, 'sprite', 'message/message-flappy-bird')

    ///////////////////
    // Get Ready label
    ///////////////////
    let getReady = this.scene.add
      .image(scene.cameras.main.width / 2, 160, 'sprite', 'message/message-get-ready')

      .setVisible(false)

    ///////////////////
    // Play Button
    ///////////////////
    let playButton = this.scene.add
      .image(scene.cameras.main.width / 2, 370, 'sprite', 'button/button-playgame')

      .setInteractive()
      .on('pointerup', pointer => {
        playGame()
      })
      .on('pointermove', pointer => {
        playButton.setScale(1.05, 1.05).setTint(0xdcdcdc)
      })
      .on('pointerout', pointer => {
        playButton.setScale(1, 1).clearTint()
      })

    ///////////////////
    // Pause Button
    ///////////////////
    let pauseButton = this.scene.add
      .image(30, 30, 'sprite', 'button/button-pause')

      .setVisible(false)
      .setInteractive()
      .on('pointerup', pointer => {
        switchToPause()
      })
      .on('pointermove', pointer => {
        pauseButton.setScale(1.05, 1.05)
      })
      .on('pointerout', pointer => {
        pauseButton.setScale(1, 1)
      })

    this.add(title).add(getReady).add(playButton).add(pauseButton).setPosition(0, 0).setDepth(5)
  }

  startGame(): void {
    let title = this.getAt(0) as Phaser.GameObjects.Image
    let getReady = this.getAt(1) as Phaser.GameObjects.Image
    let playButton = this.getAt(2) as Phaser.GameObjects.Image
    let pauseButton = this.getAt(3) as Phaser.GameObjects.Image

    title.setVisible(false)
    getReady.setVisible(true).setAlpha(0)
    playButton.setVisible(false)
    pauseButton.setVisible(true)
    this.scene.tweens.add({
      targets: getReady,
      props: {
        alpha: 1
      },
      duration: 300,
      repeat: false
    })
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scene.tweens.add({
          targets: getReady,
          props: {
            alpha: 0
          },
          duration: 300,
          repeat: false,
          onComplete: () => {
            getReady.setVisible(false)
          }
        })
      },
      callbackScope: this,
      loop: false
    })
  }

  endGame(): void {
    let pauseButton = this.getAt(3) as Phaser.GameObjects.Image
    pauseButton.setVisible(false)

    let getReady = this.getAt(1) as Phaser.GameObjects.Image
    getReady.setVisible(false)
  }
}

export default ScreenContainer
