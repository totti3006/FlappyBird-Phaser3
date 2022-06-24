import IMG_NAME from '../../constants/imageName'
import * as setting from '../../constants/settings'

class Ground extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // super(scene, x, y, IMG_NAME.ground)
    super(scene, x, y, 'sprite', 'ground')
    this.x = x
    this.y = y
    scene.physics.world.enable(this)
    scene.add.existing(this)
    this.body.setGravityY(0).setVelocityX(-setting.GAME_SPEED)

    this.body.immovable = true
    this.setDepth(3).play('ground')
  }

  update(): void {
    if (this.x < setting.WIDTH / 2 - 24) this.setX(setting.WIDTH / 2 + 24)
  }

  pause(): void {
    this.body.setVelocityX(0)
  }
}

export default Ground
