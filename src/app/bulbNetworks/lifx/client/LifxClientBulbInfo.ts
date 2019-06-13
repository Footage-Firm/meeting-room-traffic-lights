export default class LifxClientBulbInfo {

    constructor(private _id: string, private _label: string) {

    }

    get id() {
        return this._id;
    }

    get label() {
        return this._label;
    }
}