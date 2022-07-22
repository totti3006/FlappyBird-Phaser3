import AnimatedButton from '../animations/AnimatedButton'
import Bird from '../objects/Bird/Bird'

class ScreenContainer extends Phaser.GameObjects.Container {
  private playButton: AnimatedButton
  private pauseButton: AnimatedButton

  constructor(scene: Phaser.Scene, bird: Bird, playGame, switchToPause) {
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
    this.playButton = new AnimatedButton(
      this.scene,
      scene.cameras.main.width / 2,
      370,
      'sprite',
      'button/button-playgame'
    )
    this.playButton
      .setScaleRatio(1.2)
      .initButton(playGame)
      .setInteractive()
      .playScale()
      .on('pointerup', pointer => {
        this.playButton.playPointerUp().stopScale()
      })
      .on('pointermove', pointer => {
        this.playButton.playPointerMove()
      })

    ///////////////////
    // Pause Button
    ///////////////////
    this.pauseButton = new AnimatedButton(this.scene, 30, 30, 'sprite', 'button/button-pause')
    this.pauseButton
      .initButton(switchToPause)
      .setInteractive()
      .setVisible(false)
      .on('pointerup', pointer => {
        // this.pauseButton.setVisible(false)
        this.pauseButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        bird.allowFly = false
      })
      .on('pointerout', pointer => {
        bird.allowFly = true
      })

    this.add(title).add(getReady).add(this.playButton).add(this.pauseButton).setPosition(0, 0).setDepth(15)
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

  public setPauseButtonVisible(value: boolean): void {
    this.pauseButton.setVisible(value)
  }

  endGame(): void {
    let pauseButton = this.getAt(3) as Phaser.GameObjects.Image
    pauseButton.setVisible(false)

    let getReady = this.getAt(1) as Phaser.GameObjects.Image
    getReady.setVisible(false)
  }
}

export default ScreenContainer
