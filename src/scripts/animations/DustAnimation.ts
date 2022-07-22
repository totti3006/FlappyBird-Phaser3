class DustAnimation {
  private scene: Phaser.Scene
  private source: Phaser.GameObjects.Sprite

  private flyEmiiterManager: Phaser.GameObjects.Particles.ParticleEmitterManager

  constructor(source: Phaser.GameObjects.Sprite) {
    this.source = source
    this.scene = source.scene

    this.initEmitter()

    this.createFlyEmitter()
  }

  private initEmitter(): void {
    this.flyEmiiterManager = this.scene.add.particles('flappingDust')
    this.flyEmiiterManager.setDepth(10)
  }

  private createFlyEmitter(): void {
    this.flyEmiiterManager.createEmitter({
      speed: 300,
      angle: { min: 110, max: 160, steps: 10 },
      alpha: { start: 1, end: 0 },
      lifespan: 300,
      blendMode: 'SCREEN',
      scale: { start: 1, end: 1.5 },
      quantity: 10,
      on: false
    })
  }

  public playFly(): void {
    let x: number = this.source.x - this.source.width * 0.5
    let y: number = this.source.y

    this.flyEmiiterManager.emitParticleAt(x, y)
  }
}

export default DustAnimation
