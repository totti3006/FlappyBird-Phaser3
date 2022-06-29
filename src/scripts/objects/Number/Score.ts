// export class Score2 extends Phaser.GameObjects.Group {
//   private scoreValue: number
//   private fontSize: number

//   constructor(scene: Phaser.Scene, fontSize: number, x: number, y: number) {
//     super(scene)
//     this.setXY(x, y).setDepth(5)

//     this.addNum()
//   }

//   addNum(): void {
//     for (let i = 0; i < 9; i++) {
//       let digit = this.scene.add.image(0, 0, 'sprite', `digit/digit-${this.fontSize}-${i}`)
//       this.add(digit, true)
//     }
//   }
// }

class Score extends Phaser.GameObjects.Container {
  private scoreValue: number
  private fontSize: number

  private x_coor: number
  private y_coor: number

  constructor(scene: Phaser.Scene, fontSize: number, x: number, y: number) {
    super(scene)
    this.scoreValue = 0
    this.fontSize = fontSize

    this.x_coor = x
    this.y_coor = y

    this.setDepth(5)

    this.printScore()
  }

  printScore(): void {
    this.getAll().forEach(element => {
      element.destroy()
    })

    let offset = 0

    this.scoreValue
      .toString()
      .split('')
      .forEach(item => {
        let digit = this.scene.add.image(offset, 0, 'sprite', `digit/digit-${this.fontSize}-${item}`)
        this.add(digit)
        offset += digit.width
      })

    offset *= this.scale

    if (this.fontSize == 36) this.setX(this.x_coor - offset / 2).setY(this.y_coor)
    else if (this.fontSize == 20) this.setX(this.x_coor - offset / 2).setY(this.y_coor)
  }

  increaseScore = (): void => {
    this.scoreValue += 1
    this.printScore()
  }

  getScore(): number {
    return this.scoreValue
  }

  setScore(score: number) {
    this.scoreValue = score
    this.printScore()
  }
}

export default Score
