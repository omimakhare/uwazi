export class Relationship {
  readonly _id: string;

  readonly from: string;

  readonly to: string;

  readonly type: string;

  constructor(_id: string, from: string, to: string, type: string) {
    this._id = _id;
    this.from = from;
    this.to = to;
    this.type = type;
  }
}