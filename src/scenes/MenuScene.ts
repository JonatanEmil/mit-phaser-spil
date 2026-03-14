import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MenuScene" });
    }

    create(): void {
        const { width, height } = this.scale;

        this.add
            .text(width / 2, height / 2 - 60, "MIT SPIL", {
                fontSize: "48px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        const startText = this.add
            .text(width / 2, height / 2 + 40, "Tryk ENTER for at starte", {
                fontSize: "20px",
                color: "#00ff88",
            })
            .setOrigin(0.5);

        // Blink-effekt på teksten
        this.tweens.add({
            targets: startText,
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
