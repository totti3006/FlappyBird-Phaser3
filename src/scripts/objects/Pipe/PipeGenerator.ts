import Bird from '../Bird/Bird'
import Pipes from './Pipes'
import Score from '../Number/Score'
import AUDIO from '../../constants/audioName'
import * as setting from '../../constants/settings'

class PipeGenerator {
  private scene: Phaser.Scene

  private pipesList: Pipes[]

  private timeSet: Phaser.Time.TimerEvent

  private bird: Bird

  private score: Score

  private duration: number

  private scoreSound: Phaser.Sound.BaseSound

  private callback

  private pipesColor: string

  constructor(scene: Phaser.Scene, bird: Bird, score: Score, callback) {
    this.scene = scene
    this.bird = bird
    this.score = score
    this.pipesList = []
    this.callback = callback

    this.scoreSound = this.scene.sound.add(AUDIO.score)

    this.duration = ((this.scene.cameras.main.width + 160) / setting.GAME_SPEED) * 1000

    let pipeColorList = ['green', 'brown']
    this.pipesColor = pipeColorList[Phaser.Math.Between(0, 1)]
  }

  start(): void {
    this.pipeGen()

    let distance: number = 130 // distance of 2 pair of pipes
    let delay: number = (distance * this.duration) / (this.scene.cameras.main.width + 80)

    this.timeSet = this.scene.time.addEvent({
      delay: delay,
      callback: () => {
        this.pipeGen()
      },
      callbackScope: this.scene,
      loop: true
    })
  }

  private pipeGen = (): void => {
    let pipes = new Pipes(this.scene, this.duration, this.pipesColor)
    this.pipesList.push(pipes)
    let pipeChild = pipes.getAll()

    let hitPipe = this.scene.physics.add.collider(this.bird, pipeChild.splice(0, 2), (bird, child) => {
      this.scene.physics.world.removeCollider(hitPipe)
      this.scene.physics.world.disable(child)
      this.callback()
    })

    let scoreZone = this.scene.physics.add.overlap(this.bird, pipeChild, () => {
      this.scoreSound.play()
      this.score.increaseScore()
      this.scene.physics.world.removeCollider(scoreZone)
    })
  }

  stop(): void {
    this.pipesList.forEach(pipes => {
      pipes.tween.stop()
    })
  }
}

export default PipeGenerator
