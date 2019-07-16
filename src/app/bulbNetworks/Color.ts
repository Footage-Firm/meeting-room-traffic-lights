export default class Color {

    constructor(private _r: number, private _g: number, private _b: number, private _brightness: number = 20) {
    }

    get r(): number {
        return this._r;
    }

    get g(): number {
        return this._g;
    }

    get b(): number {
        return this._b;
    }

    get brightness(): number {
        return this._brightness;
    }

    get brightnessFraction(): string {
        return Math.max(Math.min(this._brightness / 100, 1.0), 0.0).toFixed(2)
    }

    static get PURPLE(): Color {
        return new this(255, 0, 255)
    }

    static get WHITE(): Color {
        return new this(255, 255, 255)
    }

    static get RED(): Color {
        return new this(255, 0, 0)
    }

    static get RED_SOFT(): Color {
        return new this(255, 0, 0, 10)
    }

    static get RED_BRIGHT(): Color {
        return new this(255, 0, 0, 40)
    }

    static get YELLOW(): Color {
        return new this(255,255,0)
    }

    static get ORANGE(): Color {
        return new this(255,220,0)
    }

    static get GREEN(): Color {
        return new this(0, 255, 0)
    }

    static get GREEN_SOFT(): Color {
        return new this(0, 255, 0, 10)
    }

    static get GREEN_BRIGHT(): Color {
        return new this(0, 255, 0, 40)
    }

    static get BLUE(): Color {
        return new this(0, 0, 255)
    }

    static get BLACK(): Color {
        return new this(0, 0, 0, 0)
    }

    toString() {
        return `Color: ${this._r},${this._g},${this._b} ${this._brightness}`
    }

}
