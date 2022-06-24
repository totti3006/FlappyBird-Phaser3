import IMG_NAME from '../../constants/imageName'

class Background extends Phaser.GameObjects.TileSprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 288, 512, IMG_NAME.background)
    this.x = x
    this.y = y

    this.setDepth(1)
    scene.add.existing(this)
  }
}

export default Background
