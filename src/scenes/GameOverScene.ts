export class GameOverScene extends Phaser.Scene {
    private finalScore: number = 0;

    constructor() {
        super({ key: "GameOverScene" });
    }

    init(data: { score: number }): void {
        // Modtag score fra GameScene
        // ?? 0 sikrer at vi får 0 hvis data er undefined
        this.finalScore = data.score ?? 0;
    }

    create(): void {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.add.text(cx, cy - 80, "GAME OVER", {
            fontSize: "48px",
            color: "#F0883E",
            fontStyle: "bold"
        }).setOrigin(0.5);

        this.add.text(cx, cy, `Score: ${this.finalScore}`, {
            fontSize: "28px",
            color: "#00E5A0"
        }).setOrigin(0.5);

        this.add.text(cx, cy + 80, "Tryk ENTER for at prøve igen", {
            fontSize: "16px",
            color: "#8B949E"
        }).setOrigin(0.5);

        this.input.keyboard!.once("keydown-ENTER", () => {
            this.scene.start("GameScene");
        });
    }
}
