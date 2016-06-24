import { expect } from "chai";
import { Person } from './module2';

describe('test', () => {
  it('works', () => {
    let value = 42;
    expect(value).to.equal(42);

    let p = new Person("bob");
    expect(p.name).to.equal('bob');
    expect(p.someFunc(5)).to.equal(42);
  });
});
