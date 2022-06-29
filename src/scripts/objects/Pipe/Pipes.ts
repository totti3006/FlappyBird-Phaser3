import * as setting from '../../constants/settings'

class PipeUp extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'sprite', 'pipe/green-pipe-up')

    this.setOrigin(0, 0).setPosition(0, 0)

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

class ScoreZone extends Phaser.GameObjects.Rectangle {
  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    super(scene, x, y, w, h)

    this.setOrigin(0, 0)
    scene.physics.add.existing(this, false)
  }
}

class Pipes extends Phaser.GameObjects.Container {
  public tween: Phaser.Tweens.Tween

  private duration: number

  constructor(scene: Phaser.Scene, duration: number) {
    super(scene)

    scene.add.existing(this)

    this.duration = duration

    let pipeUp = new PipeUp(scene)
    let pipeDown = new PipeDown(scene)
    let scoreZone = new ScoreZone(scene, 5, -420 + pipeDown.height, pipeDown.width - 5, 420 - pipeDown.height)

    this.add(pipeUp)
      .add(pipeDown)
      .add(scoreZone)
      .setPosition(scene.cameras.main.width + 80, Phaser.Math.Between(200, 360))
      .setDepth(1)

    this.move()
  }

  move(): void {
    this.tween = this.scene.tweens.add({
      targets: this,
      x: -80,
      duration: this.duration,
      loop: 0,
      onComplete: () => {
        this.destroy()
      }
    })
  }

  getDuration(): number {
    return this.duration
  }
}

export default Pipes
