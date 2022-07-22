import AnimatedButton from '../animations/AnimatedButton'
import ScreenContainer from '../Container/ScreenContainer'

class PauseScene extends Phaser.Scene {
  private resumeButton: AnimatedButton
  private screenContainer: ScreenContainer

  constructor() {
    super({ key: 'PauseScene' })
  }

  create(data): void {
    this.screenContainer = data.screenContainer

    this.resumeButton = new AnimatedButton(this, 30, 30, 'sprite', 'button/button-play')
    this.resumeButton
      .initButton(this.resumePlayScene)
      .setDepth(5)
      .setVisible(true)
      .setInteractive()
      .on('pointerup', pointer => {
        this.resumeButton.playPointerUp()
      })

    this.input.keyboard.on('keydown-SPACE', this.resumePlayScene, this)
  }

  private resumePlayScene = (): void => {
    this.scene.resume('PlayScene')
    this.resumeButton.setVisible(false)
    this.screenContainer.setPauseButtonVisible(true)
  }
}

export default PauseScene
