class Score {
  private scene: Phaser.Scene
  private scoreValue: number
  private fontSize: number
  private scoreGroup: Phaser.GameObjects.Group
  private x: number
  private y: number
  private align: string

  constructor(scene: Phaser.Scene, fontSize: number, x: number, y: number, align: string = 'right') {
    this.scene = scene

    this.fontSize = fontSize

    this.scoreValue = 0

    this.x = x
    this.y = y

    this.align = align

    this.scoreGroup = scene.add.group()

    this.initScore()
  }

  private initScore(): void {
    let offset: number = 0
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i <= 9; i++) {
        let digit = this.scene.add
          .image(this.x, this.y, 'sprite', `digit/digit-${this.fontSize}-${i}`)
          .setVisible(false)

        if (i == 0 && j == 0) {
          offset = digit.width
          // digit.setVisible(true)
        }

        digit.setX(this.x - j * offset).setDepth(5)

        this.scoreGroup.add(digit)
        this.scene.add.existing(digit)
      }
    }
  }

  start(): void {
    let digit = this.scoreGroup.getChildren() as Phaser.GameObjects.Image[]
    digit[0].setVisible(true)
  }

  destroy(): void {
    this.scoreGroup.setVisible(false)
  }

  getScore(): number {
    return this.scoreValue
  }

  setScore(score: number): void {
    if (score > 0) {
      this.scoreValue = score
      this.updateDisplay()
    } else {
      this.start()
    }
  }

  increaseScore(): void {
    this.scoreValue++
    this.updateDisplay()
  }

  private updateDisplay(): void {
    // format number: abc
    let a: number = Math.floor((this.scoreValue - 1) / 100) % 10
    let b: number = Math.floor((this.scoreValue - 1) / 10) % 10
    let c: number = (this.scoreValue - 1) % 10

    let digit = this.scoreGroup.getChildren() as Phaser.GameObjects.Image[]

    let a_index: number = 20 + a
    let b_index: number = 10 + b
    let c_index: number = c

    digit[a_index].setVisible(false)
    digit[b_index].setVisible(false)
    digit[c_index].setVisible(false)

    c_index++
    if (c_index == 10) {
      c_index = 0
      b_index++
      if (b_index == 20) {
        b_index = 10
        a_index++
        if (a_index == 30) {
          a_index = 20
        }
      }
    }

    if (a_index != 20) digit[a_index].setVisible(true)
    if (a_index != 20 || b_index != 10) digit[b_index].setVisible(true)
    digit[c_index].setVisible(true)

    if (this.scoreValue == 10 || this.scoreValue == 100) {
      if (this.align == 'center') this.alignCenter()
      if (this.align == 'left') this.alignLeft()
    }
  }

  private alignCenter(): void {
    let digit = this.scoreGroup.getChildren() as Phaser.GameObjects.Image[]
    Phaser.Actions.IncX(this.scoreGroup.getChildren(), digit[0].width / 2)
  }

  private alignLeft(): void {
    let digit = this.scoreGroup.getChildren() as Phaser.GameObjects.Image[]
    Phaser.Actions.IncX(this.scoreGroup.getChildren(), digit[0].width)
  }
}

export default Score
