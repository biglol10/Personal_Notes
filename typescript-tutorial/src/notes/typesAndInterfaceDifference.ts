///////////// The Difference between type and interface
type X = {
  a: string;
  b: number;
};
type Y = X & {
  // type Y is going to contain all properties of X and Y
  c: string;
  d: number;
};
// let y: Y = {
//   // if you don't assign a,b => error
//   c: 'qwer',
//   d: 42,
// };

// in the case of interface
interface Person {
  name: string;
  age?: number;
}

interface Guy extends Person {
  // interface is easier to use and extending is easier
  profession: string;
}

type C = Person & {
  // type C will have properties of Person
  a: string;
  b: number;
};

interface IPerson extends X {
  // interface IPerson will have properties of X
  name: string;
  age: number;
}

// class name extends Person {
//   constructor() {
//     this.name = 'asdf';
//     this.age = 5;
//   }
// }

export {};
