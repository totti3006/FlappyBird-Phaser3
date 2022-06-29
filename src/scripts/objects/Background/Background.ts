import IMG_NAME from '../../constants/imageName'

class Background extends Phaser.GameObjects.TileSprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    let bgList = [IMG_NAME.bg_day, IMG_NAME.bg_night]
    let bg: string = bgList[Phaser.Math.Between(0, 1)]
    super(scene, x, y, 288, 512, bg)
    this.x = x
    this.y = y

    this.setDepth(1)
    scene.add.existing(this)
  }
}

export default Background
