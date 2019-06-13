export default class MagicHomeBulbInfo {

    constructor(private _id: string, private _ip: string) {

    }

    get id() {
        return this._id;
    }

    get ip() {
        return this._ip;
    }
}