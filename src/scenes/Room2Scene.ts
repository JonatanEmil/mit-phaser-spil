import Phaser from "phaser";

export class Room2Scene extends Phaser.Scene {
    private score: number = 0;

    constructor() {
        super({ key: "Room2Scene" });
    }

    init(data: { score: number }): void {
        // Modtag score fra Room1Scene
        this.score = data.score ?? 0;
    }

    create(): void {
        const TILE  = 16;
        const SCALE = 2;

        // ─── Kort til rum 2 ──────────────────────────────────────────
        // Byg dit eget kort her — eller brug et af disse som udgangspunkt
        const map = [
            "RWWWWWWWWWWWWWWS",
            "O..............Q",
            "O..............Q",
            "O..............Q",
            "O..............Q",
            "O.....P........Q",
            "O..............Q",
            "O..............Q",
            "O..............Q",
            "TVVVVVVVVVVVVVVU",
        ];

        const FLOOR_FRAME        = 109; // ← ret til dine frame-numre
        const UPPER_WALL_FRAME   = 97;
        const LOWER_WALL_FRAME   = 121;
        const LEFT_WALL_FRAME    = 108;
        const RIGHT_WALL_FRAME   = 110;
        const UPPER_LEFT_CORNER  = 96;
        const UPPER_RIGHT_CORNER = 98;
        const LOWER_RIGHT_CORNER = 122;
        const LOWER_LEFT_CORNER  = 120;

        const walls = this.physics.add.staticGroup();
        let playerX = 0;
        let playerY = 0;

        map.forEach((row, rowIndex) => {
            row.split("").forEach((cell, colIndex) => {
                const x = colIndex * TILE * SCALE + (TILE * SCALE) / 2;
                const y = rowIndex * TILE * SCALE + (TILE * SCALE) / 2;

                if (cell === "U") {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", LOWER_RIGHT_CORNER);
                    wall.setScale(SCALE); wall.refreshBody(); walls.add(wall);
                } else if (cell === "T") {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", LOWER_LEFT_CORNER);
                    wall.setScale(SCALE); wall.refreshBody(); walls.add(wall);
                } else if (cell === "S") {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", UPPER_RIGHT_CORNER);
                    wall.setScale(SCALE); wall.refreshBody(); walls.add(wall);
                } else if (cell === "R") {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", UPPER_LEFT_CORNER);
                    wall.setScale(SCALE); wall.refreshBody(); walls.add(wall);
                } else if (cell === "W") {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", UPPER_WALL_FRAME);
                    wall.setScale(SCALE); wall.refreshBody(); walls.add(wall);
                } else if (cell === "V") {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", LOWER_WALL_FRAME);
                    wall.setScale(SCALE); wall.refreshBody(); walls.add(wall);
                } else if (cell === "O") {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", LEFT_WALL_FRAME);
                    wall.setScale(SCALE); wall.refreshBody(); walls.add(wall);
                } else if (cell === "Q") {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", RIGHT_WALL_FRAME);
                    wall.setScale(SCALE); wall.refreshBody(); walls.add(wall);
                } else {
                    this.add.image(x, y, "tilemap", FLOOR_FRAME).setScale(SCALE);
                    if (cell === "P") {
                        playerX = x;
                        playerY = y;
                    }
                }
            });
        });

        // ─── Spiller ─────────────────────────────────────────────────
        const player = this.physics.add.sprite(playerX, playerY, "tilemap", 96);
        player.setScale(SCALE);
        player.setCollideWorldBounds(true);

        this.physics.add.collider(player, walls);

        // ─── Kamera ──────────────────────────────────────────────────
        const mapWidth  = map[0].length * TILE * SCALE;
        const mapHeight = map.length    * TILE * SCALE;
        this.cameras.main
            .setBounds(0, 0, mapWidth, mapHeight)
            .startFollow(player);

        // ─── Input ───────────────────────────────────────────────────
        const cursors = this.input.keyboard!.createCursorKeys();

        // ─── Score fra rum 1 ─────────────────────────────────────────
        this.add.text(16, 16, "Score: " + this.score, {
            fontSize: "18px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0);

        // ─── Update via event ─────────────────────────────────────────
        // Da vi ikke har en klasse her, bruger vi en lokal funktion
        this.events.on("update", () => {
            player.setVelocity(0);
            if (cursors.left.isDown)  player.setVelocityX(-120);
            if (cursors.right.isDown) player.setVelocityX(120);
            if (cursors.up.isDown)    player.setVelocityY(-120);
            if (cursors.down.isDown)  player.setVelocityY(120);
        });
    }
}
