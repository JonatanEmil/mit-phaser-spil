import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
    private walls!: Phaser.Physics.Arcade.StaticGroup;
    private player!: Phaser.Physics.Arcade.Sprite;  // ← tilføj denne
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;  // ← og denne
    private items!: Phaser.Physics.Arcade.StaticGroup;  // ← tilføj
    private score: number = 0;                          // ← tilføj
    private scoreText!: Phaser.GameObjects.Text;        // ← tilføj

    constructor() {
        super({ key: "GameScene" });
    }

    create(): void {
        // ─── Kortets layout ──────────────────────────────────────────
        // Bogstaver bestemmer hvilken tile der tegnes hvor:
        // R = øvre venstre hjørne    W = øverste væg    S = øvre højre hjørne
        // O = venstre væg            . = gulv            Q = højre væg
        // T = nedre venstre hjørne   V = nederste væg   U = nedre højre hjørne

        const map = [
            "RWWWWWWWWWWSRWWWWS",
            "OJJJJJJJJCJQOJJJJQ",
            "O..........QO....Q",
            "O..........QO....Q",
            "O..........QO....Q",
            "O..........DE....Q",
            "O..........JJ....Q",
            "O................Q",
            "O................Q",
            "TVVVVVVVVVVVVVVVVU",
        ];

        const TILE  = 32;   // ← din tile-størrelse i pixels
        const SCALE = 1;    // forstørrelse — prøv 2 eller 3

        // ─── Dine frame-numre ────────────────────────────────────────
        const FLOOR_FRAME         = 48;   // ← ret til dine numre
        const UPPER_WALL_FRAME    = 2;
        const UPPER_BASEWALL_FRAME    = 40;
        const LOWER_WALL_FRAME    = 26;
        const LEFT_WALL_FRAME     = 13;
        const RIGHT_WALL_FRAME    = 15;
        const UPPER_LEFT_CORNER   = 1;
        const INNER_UPPER_LEFT_CORNER   = 4;
        const INNER_UPPER_RIGHT_CORNER   = 5;
        const UPPER_RIGHT_CORNER  = 3;
        const LOWER_LEFT_CORNER   = 25;
        const INNER_LOWER_LEFT_CORNER   = 16;
        const INNER_LOWER_RIGHT_CORNER   = 17;
        const LOWER_RIGHT_CORNER  = 27;
        const DOOR_CLOSED_FRAME = 45;
        const DOOR_OPEN_FRAME = 9;

        this.walls = this.physics.add.staticGroup();
        const mapWidth  = map[0].length * TILE * SCALE;
        const mapHeight = map.length    * TILE * SCALE;

        const offsetX = (this.scale.width  - mapWidth)  / 2;
        const offsetY = (this.scale.height - mapHeight) / 2;

        // ─── Tegn kortet tile for tile ───────────────────────────────
        map.forEach((row, rowIndex) => {
            row.split("").forEach((cell, colIndex) => {
                const x = offsetX + colIndex * TILE * SCALE + (TILE * SCALE) / 2;
                const y = offsetY + rowIndex * TILE * SCALE + (TILE * SCALE) / 2;

                // Tegn altid gulv som bund-lag
                this.add.image(x, y, "tilemap", FLOOR_FRAME).setScale(SCALE);

                // Læg væg ovenpå hvis nødvendigt
                let wallFrame: number | null = null;

                if      (cell === "R") wallFrame = UPPER_LEFT_CORNER;
                else if (cell === "S") wallFrame = UPPER_RIGHT_CORNER;
                else if (cell === "A") wallFrame = INNER_UPPER_RIGHT_CORNER;
                else if (cell === "B") wallFrame = INNER_UPPER_LEFT_CORNER;
                else if (cell === "T") wallFrame = LOWER_LEFT_CORNER;
                else if (cell === "U") wallFrame = LOWER_RIGHT_CORNER;
                else if (cell === "E") wallFrame = INNER_LOWER_RIGHT_CORNER;
                else if (cell === "D") wallFrame = INNER_LOWER_LEFT_CORNER;
                else if (cell === "W") wallFrame = UPPER_WALL_FRAME;
                else if (cell === "J") wallFrame = UPPER_BASEWALL_FRAME;
                else if (cell === "V") wallFrame = LOWER_WALL_FRAME;
                else if (cell === "O") wallFrame = LEFT_WALL_FRAME;
                else if (cell === "Q") wallFrame = RIGHT_WALL_FRAME;
                else if (cell === "C") wallFrame = DOOR_CLOSED_FRAME;
                else if (cell === "O") wallFrame = DOOR_OPEN_FRAME;

                if (wallFrame !== null) {
                    const wall = this.physics.add.staticSprite(x, y, "tilemap", wallFrame);
                    wall.setScale(SCALE);
                    wall.refreshBody();
                    this.walls.add(wall);
                }
            });
        });
        // ─── Spawn spiller efter kortet er tegnet ────────────────────
// Vigtigt: spawnes sidst så spilleren tegnes øverst
        const PLAYER_FRAME = 96;   // ← ret til dit frame-nummer
        const PLAYER_START_X = 10; // ← hvilken kolonne (tæl fra 0)
        const PLAYER_START_Y = 10; // ← hvilken række (tæl fra 0)

        const px = PLAYER_START_X * TILE * SCALE + (TILE * SCALE) / 2;
        const py = PLAYER_START_Y * TILE * SCALE + (TILE * SCALE) / 2;

        this.player = this.physics.add.sprite(px, py, "tilemap", PLAYER_FRAME);
        this.player.setScale(SCALE);
        this.player.setCollideWorldBounds(true);
        // ─── Kollision ───────────────────────────────────────────────
// Forhindrer spilleren i at gå through vægge
        this.physics.add.collider(this.player, this.walls);

// ─── Kamera ──────────────────────────────────────────────────
// Kameraet følger spilleren
        this.cameras.main
            .setBounds(0, 0, mapWidth, mapHeight)
            .startFollow(this.player);

// ─── Input ───────────────────────────────────────────────────
        this.cursors = this.input.keyboard!.createCursorKeys();

        // ─── Items ───────────────────────────────────────────────────
        const ITEM_FRAME = 114; // ← ret til dit frame-nummer

        this.items = this.physics.add.staticGroup();

// Placer items på specifikke tile-koordinater
// Format: [kolonne, række] — tæl fra 0 i dit map-array
        const itemPositions = [
            [7, 5],
            [22, 11],
            [10, 8],
            [20, 5],
            [15, 7],
        ];

        itemPositions.forEach(([col, row]) => {
            const x = col * TILE * SCALE + (TILE * SCALE) / 2;
            const y = row * TILE * SCALE + (TILE * SCALE) / 2;
            // Når du opretter items:
            const item = this.items.create(x, y, "tilemap", ITEM_FRAME);
            item.setScale(SCALE);
            item.refreshBody();
            item.setData("points", 10); // ← gem point-værdien
        });
        // ─── Overlap: spiller samler item op ─────────────────────────
        this.physics.add.overlap(
            this.player,
            this.items,
            (_player, item) => {
                // Fjern itemet fra verden
                (item as Phaser.Physics.Arcade.Sprite).destroy();

                // Øg score
                // I overlap-funktionen:
                const points = (item as Phaser.Physics.Arcade.Sprite).getData("points");
                this.score += points;
                // I overlap-funktionen:
                this.scoreText.setText(
                    "Score: " + this.score + "  |  Items tilbage: " + this.items.countActive()
                );

                // Tjek om alle items er samlet op - Win condition
                if (this.items.countActive() === 0) {
                    this.add.text(
                        this.cameras.main.centerX,
                        this.cameras.main.centerY,
                        "Du vandt!",
                        { fontSize: "32px", color: "#00E5A0" }
                    ).setOrigin(0.5).setScrollFactor(0);
                }
            }
        );
        // I create() — efter items er placeret:
        this.scoreText.setText(
            "Score: 0  |  Items tilbage: " + this.items.countActive()
        );

        // ─── Score-tekst ─────────────────────────────────────────────
// setScrollFactor(0) fastgør teksten til skærmen — ikke verden
        this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "18px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0);


// laver player walk animation
        this.time.addEvent({
            delay: 120, // millisekunder mellem hvert skift
            loop: true,
            callback: () => {
                if (this.player.body!.velocity.x !== 0 || this.player.body!.velocity.y !== 0) {
                    this.player.angle = this.player.angle === -3 ? 3 : -3;
                } else {
                    this.player.angle = 0; // nulstil når spilleren står stille
                }
            }
        });
    }

    update(): void {
        const speed = 240; // pixels per sekund — prøv at ændre dette

        // Nulstil hastighed hver frame
        this.player.setVelocity(0);

        // Bevæg spilleren efter hvilke taster der holdes nede
        if (this.cursors.left.isDown)  this.player.setVelocityX(-speed) && this.player.setFlipX(true);
        if (this.cursors.right.isDown) this.player.setVelocityX(speed) && this.player.setFlipX(false);
        if (this.cursors.up.isDown)    this.player.setVelocityY(-speed);
        if (this.cursors.down.isDown)  this.player.setVelocityY(speed);

        // Normaliser hastigheden ved diagonal bevægelse
        const vx = (this.cursors.left.isDown ? -1 : 0) + (this.cursors.right.isDown ? 1 : 0);
        const vy = (this.cursors.up.isDown   ? -1 : 0) + (this.cursors.down.isDown  ? 1 : 0);
        const len = Math.sqrt(vx * vx + vy * vy) || 1;

        this.player.setVelocityX((vx / len) * speed);
        this.player.setVelocityY((vy / len) * speed);
    }

}
