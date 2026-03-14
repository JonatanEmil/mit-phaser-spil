import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }
    preload(): void {
        this.load.spritesheet("tilemap", "assets/tilemaps/tilemap.png", {
            frameWidth: 32,   // ← ret til din tile-størrelse
            frameHeight: 32,  // ← ret til din tile-størrelse
            spacing: 2,       // ← 0 hvis der ikke er mellemrum
            margin: 0
        });
    }

    create(): void {
        this.scene.start("MenuScene");
    }
}
