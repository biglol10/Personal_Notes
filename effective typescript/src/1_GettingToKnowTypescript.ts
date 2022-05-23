interface Square {
  kind: "square";
  width: number;
}

interface Rectangle {
  kind: "rectangle";
  height: number;
  width: number;
}

// The Shape type here is an example of a “tagged union.” Because they make it so easy to recover type information at runtime, tagged unions are ubiquitous in TypeScript.
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape.kind === "rectangle") {
    shape; // Type is Rectangle (try hovering)
    return shape.width * shape.height;
  } else {
    shape; // Type is Square
    return shape.width * shape.width;
  }
}

// Some constructs introduce both a type (which is not available at runtime) and a value (which is). The class keyword is one of these

class Square1 {
  constructor(public width: number) {}
}

class Rectangle1 extends Square1 {
  constructor(public width: number, public height: number) {
    super(width);
  }
}

type Shape1 = Square1 | Rectangle1;

// This works because class Rectangle1 introduces both a type and a value, whereas interface only introduced a type
// The Rectangle in type Shape = Square | Rectangle refers to the type, but the Rectangle in shape instanceof Rectangle refers to the value.
// This distinction is important to understand but can be quite subtle
function calculateArea1(shape: Shape1) {
  if (shape instanceof Rectangle1) {
    shape;
    return shape.width * shape.height;
  } else {
    shape;
    return shape.width * shape.width;
  }
}

// Type Operations Cannot Affect Runtime Values
// To normalize the value you’ll need to check its runtime type and do the conversion using JavaScript constructs
function asNumber(val: number | string): number {
  return typeof val === "string" ? Number(val) : val;
}

// The first two declarations of add only provide type information.
// When TypeScript produces JavaScript output, they are removed, and only the implementation remains
function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a, b) {
  return a + b;
}

const three = add(1, 2); // Type is number
const twelve = add("1", "2"); // Type is string

// ****** Structural Typing
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}

const v: NamedVector = { x: 3, y: 4, name: "Biglol" };
calculateLength(v);

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

function normalize(v: Vector3D) {
  const length = calculateLength(v);
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}

// ****** Think of Types as Sets of Values

// The & operator computes the intersection of two types. What sorts of values belong to the PersonSpan type?
// On first glance the Person and Lifespan interfaces have no properties in common, so you might expect it to be the empty set (i.e., the never type).
// But type operations apply to the sets of values (the domain of the type), not to the properties in the interface.
// And remember that values with additional properties still belong to a type. So a value that has the properties of both Person and Lifespan will belong
// to the intersection type:
interface Person {
  name: string;
}

interface LifeSpan {
  birth: Date;
  death?: Date;
}

type PersonSpan = Person & LifeSpan;

const ps: PersonSpan = {
  name: "smth",
  birth: new Date("1912/06/23"),
  // death: new Date("1954/06/07"),
};

// ****** Use extends
interface Person2 {
  name: string;
}

interface LifeSpan2 extends Person2 {
  // think of extends as “subset of”
  birth: Date;
  death?: Date;
}

// ****** keyof T returns type for just the keys of an object type
interface Point {
  x: number;
  y: number;
}

type PointKeys = keyof Point; // Type is "x" | "y"

function sortBy<K extends keyof T, T>(vals: T[], key: K): T[] {
  // ...
  return [];
}
