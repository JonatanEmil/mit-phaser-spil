import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameOverScene" });
    }

    init(data: { score: number }): void {
        const { width, height } = this.scale;

        this.add
            .text(width / 2, height / 2 - 60, "GAME OVER", {
                fontSize: "48px",
                color: "#ff4444",
            })
            .setOrigin(0.5);

        this.add
            .text(width / 2, height / 2, `Score: ${data.score}`, {
                fontSize: "28px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        const retryText = this.add
            .text(width / 2, height / 2 + 60, "Tryk ENTER for at prøve igen", {
                fontSize: "20px",
                color: "#00ff88",
            })
            .setOrigin(0.5);

        this.tweens.add({
            targets: retryText,
            alpha: 0,
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        this.input.keyboard!.once("keydown-ENTER", () => {
            this.scene.start("GameScene");
        });
    }
}
