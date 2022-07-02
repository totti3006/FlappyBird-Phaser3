import IMG_NAME from '../../constants/imageName'
import * as setting from '../../constants/settings'

class Ground extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'sprite', 'ground')
    this.x = 0
    this.y = 400
    scene.physics.world.enable(this)
    scene.add.existing(this)

    let speed: number = setting.GAME_SPEED

    this.body.setGravityY(0).setVelocityX(-speed)

    this.body.immovable = true
    this.setDepth(10).play('ground').setOrigin(0, 0)
  }

  update(): void {
    if (this.x <= -(this.width - this.scene.cameras.main.width)) this.setX(0)
  }

  pause(): void {
    this.body.setVelocityX(0)
  }
}

export default Ground
