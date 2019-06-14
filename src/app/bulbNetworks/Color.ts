export default class Color {

    constructor(private _r: number, private _g: number, private _b: number, private _brightness: number = 100) {
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

    static get PURPLE(): Color {
        return new this(255, 0, 255)
    }

    static get WHITE(): Color {
        return new this(255, 255, 255)
    }

    static get RED(): Color {
        return new this(255, 0, 0)
    }

    static get YELLOW(): Color {
        return new this(255,255,0)
    }

    static get ORANGE(): Color {
        return new this(255,75,0)
    }

    static get GREEN(): Color {
        return new this(0, 255, 0)
    }

    static get BLUE(): Color {
        return new this(0, 0, 255)
    }

    static get BLACK(): Color {
        return new this(0, 0, 0, 0)
    }

}
