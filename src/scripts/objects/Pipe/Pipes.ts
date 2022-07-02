import * as setting from '../../constants/settings'

class PipeUp extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, color: string) {
    super(scene, 0, 0, 'sprite', `pipe/${color}-pipe-up`)

    this.setOrigin(0, 0).setPosition(0, 0)

    scene.physics.world.enable(this)
    this.body.setSize(this.width, this.height)

    scene.add.existing(this)
  }
}

class PipeDown extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, color: string) {
    super(scene, 0, 0, 'sprite', `pipe/${color}-pipe-down`)

    this.setOrigin(0, 0).setPosition(0, -418)

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
  public upDown: Phaser.Tweens.Tween

  private merciless: boolean

  private duration: number

  constructor(scene: Phaser.Scene, duration: number, color: string, merciless: boolean = false) {
    super(scene)

    scene.add.existing(this)

    this.duration = duration
    this.merciless = merciless

    let pipeUp = new PipeUp(scene, color)
    let pipeDown = new PipeDown(scene, color)
    let scoreZone = new ScoreZone(scene, 5, -418 + pipeDown.height, pipeDown.width - 5, 418 - pipeDown.height)

    this.add(pipeUp)
      .add(pipeDown)
      .add(scoreZone)
      .setPosition(scene.cameras.main.width + 80, Phaser.Math.Between(200, 360))
      .setDepth(1)

    this.move()
  }

  move(): void {
    if (this.merciless) {
      let signs: number[] = [-1, 1]
      let sign: number = signs[Phaser.Math.Between(0, 1)]
      let up: number = Phaser.Math.Between(25, 35) * sign
      let down: number = Phaser.Math.Between(25, 35) * sign * -1
      this.upDown = this.scene.tweens.add({
        targets: this,
        y: { from: this.y + up, to: this.y + down },
        duration: 900,
        yoyo: true,
        repeat: -1
      })
    }

    this.tween = this.scene.tweens.add({
      targets: this,
      x: -80,
      duration: this.duration,
      loop: 0,
      onComplete: () => {
        this.destroy()
        this.upDown?.stop()
      }
    })
  }

  getDuration(): number {
    return this.duration
  }
}

export default Pipes
