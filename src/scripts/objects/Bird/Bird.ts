import { Physics, Tweens } from 'phaser'
import IMG_NAME from '../../constants/imageName'
import AUDIO from '../../constants/audioName'
import DustAnimation from '../../animations/DustAnimation'

class Bird extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  public idle: boolean = true
  public isDeath: boolean = false
  public freeFalling: boolean = false
  public hitPipe: boolean = false
  private flapSound: Phaser.Sound.BaseSound
  private chilling: Tweens.Tween

  public allowFly: boolean = true

  private color: string

  private dustAnimation: DustAnimation

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, 0, 0, '')

    this.setPosition(x, y)

    this.dustAnimation = new DustAnimation(this)

    let birdColorList = ['yellow', 'red', 'blue']
    this.color = birdColorList[Phaser.Math.Between(0, 2)]

    this.anims.create({
      key: 'chill_flapping',
      frames: this.anims.generateFrameNames('sprite', { prefix: `bird/${this.color}-bird-`, end: 2 }),
      frameRate: 8,
      repeat: -1
    })

    this.chilling = scene.tweens.add({
      targets: this,
      y: { from: this.y + 3, to: this.y - 3 },
      duration: 360,
      paused: false,
      yoyo: true,
      repeat: -1
    })

    scene.physics.world.enable(this)
    scene.add.existing(this)

    this.setDepth(6).play('chill_flapping')

    this.body
      .setOffset(4, -1)
      .setMaxVelocityY(500)
      .setBounceY(0)
      .setCollideWorldBounds(true)
      // .setSize(this.width * 0.9, this.height * 0.9)
      .setCircle(this.width * 0.7 * 0.55)

      .setBoundsRectangle(
        new Phaser.Geom.Rectangle(0, -10, this.scene.cameras.main.width, this.scene.cameras.main.height)
      )

    this.flapSound = this.scene.sound.add(AUDIO.flap)
  }

  public setPlay(): void {
    this.chilling.stop()
    this.anims.remove('chill_flapping')
    this.anims.create({
      key: 'rapid_flapping',
      frames: this.anims.generateFrameNames('sprite', { prefix: `bird/${this.color}-bird-`, end: 2 }),
      frameRate: 16,
      repeat: -1
    })

    this.play('rapid_flapping')

    this.jump()
  }

  public jump(): void {
    this.dustAnimation.playFly()
    this.flapSound.play()
    this.body.setVelocityY(-350).setGravityY(1200)

    if (this.freeFalling) this.anims.resume()

    this.scene.tweens.add({
      targets: this,
      props: {
        angle: -20
      },
      duration: 150,
      ease: 'Power0'
    })
  }

  public setDie(): void {
    if (this.angle < 90) {
      let dieTween = this.scene.tweens.add({
        targets: this,
        props: {
          angle: 90
        },
        duration: 200,
        loop: false,
        onComplete: () => {
          dieTween.stop()
        }
      })
    }
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    if (!this.idle && this.body.velocity.y >= 380) {
      if (this.angle >= -20 && this.angle < 90) this.angle += 5
      if (this.anims.currentFrame.textureFrame == 'bird/yellow-bird-1') this.anims.pause()
      this.freeFalling = true
    }
  }
}

export default Bird
