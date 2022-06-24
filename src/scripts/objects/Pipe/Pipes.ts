import * as setting from '../../constants/settings'

class PipeUp extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'sprite', 'pipe/green-pipe-up')

    this.setOrigin(0, 0).setPosition(0, 10)

    scene.physics.world.enable(this)
    this.body.setSize(this.width, this.height)

    scene.add.existing(this)
  }
}

class PipeDown extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'sprite', 'pipe/green-pipe-down')

    this.setOrigin(0, 0).setPosition(0, -420)

    scene.physics.world.enable(this)
    this.body.setSize(this.width, this.height)

    scene.add.existing(this)
  }
}

class Pipes extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene)

    scene.add.existing(this)

    let pipeUp = new PipeUp(scene)
    let pipeDown = new PipeDown(scene)

    this.add(pipeUp)
      .add(pipeDown)
      .setPosition(scene.cameras.main.width + 80, Phaser.Math.Between(200, 360))
      .setDepth(1)

    this.move()
  }

  move(): void {
    let duration = ((this.x + 80) / setting.GAME_SPEED) * 1000

    this.scene.tweens.add({
      targets: this,
      x: -80,
      duration: duration,
      loop: 0,
      onComplete: () => {
        this.destroy()
      }
    })
  }
}

export default Pipes
