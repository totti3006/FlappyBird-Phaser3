class PauseScene extends Phaser.Scene {
  private resumeButton: Phaser.GameObjects.Image

  constructor() {
    super({ key: 'PauseScene' })
  }

  create(): void {
    this.resumeButton = this.add.image(30, 30, 'sprite', 'button/button-play').setDepth(5).setVisible(true)

    this.input.keyboard.on(
      'keydown-SPACE',
      () => {
        this.scene.resume('PlayScene')
        this.resumeButton.setVisible(false)
      },
      this
    )

    this.input.once(
      'pointerup',
      () => {
        this.scene.resume('PlayScene')
        this.resumeButton.setVisible(false)
      },
      this
    )
  }
}

export default PauseScene
