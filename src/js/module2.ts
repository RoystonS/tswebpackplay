export class Person {
  constructor(public name: string) {
  }

  someFunc(x) {
    if (x) { return 99; }

    return x ? 42 : 78;
  }

  public toString() {
    return `Person ${this.name}`;
  }
}

export class Bar {

}

export function iAmNotUsedAnywhere() {

}
