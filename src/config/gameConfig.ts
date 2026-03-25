import Phaser from "phaser";
import { BootScene } from "@scenes/BootScene";
import { MenuScene } from "@scenes/MenuScene";
import { Room1Scene } from "@scenes/Room1Scene";
import { Room2Scene } from "@scenes/Room2Scene";
import { GameOverScene } from "@scenes/GameOverScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,           // Bruger WebGL hvis tilgængeligt, ellers Canvas
    width: 960,
    height: 540,
    backgroundColor: "#1a1a2e",
    physics: {
        default: "arcade",
        arcade: {
            debug: true,            // Sæt til true for at se hitboxes
        },
    },
    scene: [BootScene, MenuScene, Room1Scene, Room2Scene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};