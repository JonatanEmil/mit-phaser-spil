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
        this.load.spritesheet("skeleton", "assets/spriteSheets/skeleton-spritesheet.png", {
            frameWidth: 64,   // ← ret til din tile-størrelse
            frameHeight: 64,  // ← ret til din tile-størrelse
            spacing: 0,       // ← 0 hvis der ikke er mellemrum
            margin: 0
        });
        // ─── Lyde ────────────────────────────────────────────────────
        this.load.audio("potion",  "assets/audio/potion.mp3");
        this.load.audio("hurt",  "assets/audio/hurt.mp3");
        this.load.audio("music", "assets/audio/music.mp3");
        this.load.audio("win", "assets/audio/victory.mp3");

    }

    create(): void {
        this.scene.start("MenuScene");
    }
}
