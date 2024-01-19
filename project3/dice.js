class Dice {
    constructor(id) {
        this.id = `${id}`;
        this.roll();
    }

    // Randomly change the face of the dice
    roll() {
        let val = Math.floor(Math.random() * 8);
        this.face = Object.keys(FACES)[val];
        
    }

    // Check what face the dice should be displaying
    getFace() {
        return this.face;
    }

    getID() {
        return this.id;
    }
}
