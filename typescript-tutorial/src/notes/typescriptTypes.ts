let name: string;
let age: number;
let ageAnother: number | string; // age = 5, age = "asdf"
let isStudent: boolean;
let hobbies: string[];
let role: [number, string]; // [5, "added"]  => tuple
let anyany: any; // not recommended
let unknownType: unknown; // use this instead of any

function printName(name: string) {
  console.log(name);
}

// type is something called as alias. alias is of 2 types and they are type & interface
type Person = {
  name: string;
  age?: number;
};
interface IPerson {
  name: string;
  age?: number;
}

let person: Person = {
  name: 'Piyush',
  age: 22,
};

let printNameFunction: (name: string) => void; // void returns undefined
// let printNameFunction: (name: string) => never; // if you don't know if it is going to return anything or not

let lotsOfPeople: Person[];

const getResult = (username: string): string => {
  return 'asdf';
};

export {};
