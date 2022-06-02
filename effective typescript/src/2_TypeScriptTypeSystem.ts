interface Square {
	kind: 'square';
	width: number;
}

interface Rectangle {
	kind: 'rectangle';
	height: number;
	width: number;
}

// The Shape type here is an example of a “tagged union.” Because they make it so easy to recover type information at runtime, tagged unions are ubiquitous in TypeScript.
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
	if (shape.kind === 'rectangle') {
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
	return typeof val === 'string' ? Number(val) : val;
}

// The first two declarations of add only provide type information.
// When TypeScript produces JavaScript output, they are removed, and only the implementation remains
function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a, b) {
	return a + b;
}

const three = add(1, 2); // Type is number
const twelve = add('1', '2'); // Type is string

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

const v: NamedVector = { x: 3, y: 4, name: 'Biglol' };
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
	name: 'smth',
	birth: new Date('1912/06/23'),
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

const pts: Point[] = [
	{ x: 1, y: 1 },
	{ x: 2, y: 0 },
];

sortBy(pts, 'x'); // OK, 'x' extends 'x'|'y' (aka keyof T)
sortBy(pts, 'y'); // OK, 'y' extends 'x'|'y' (aka keyof T)
sortBy(pts, Math.random() < 0.5 ? 'x' : 'y'); // OK, 'x'|'y' extends 'x'|'y'
// sortBy(pts, "z"); // Argument of type '"z"' is not assignable to parameter of type 'keyof Point'

interface Person3 {
	first: string;
	last: string;
}
const p: Person3 = { first: 'Jane', last: 'Jacobs' };

function email(p: Person, subject: string, body: string): Response {
	//     ----- -          -------          ----  Values
	//              ------           ------        ------   -------- Types
	// ...
	return null;
}

// In a value context, typeof is JavaScript’s runtime typeof operator. It returns a string containing the runtime type of the symbol.
// This is not the same as the TypeScript type! JavaScript’s runtime type system is much simpler than TypeScript’s static type system.
// In contrast to the infinite variety of TypeScript types, JavaScript’s typeof operator has historically only had six possible return values:
// “string,” “number,” “boolean,” “undefined,” “object,” and “function.”

type T1 = typeof p; // Type is Person
type T2 = typeof email;
// Type is (p: Person, subject: string, body: string) => Response

const v1 = typeof p; // Value is "object"
const v2 = typeof email; // Value is "function"

class Cylinder {
	radius = 1;
	height = 1;
}

// typeof always operates on values. You can’t apply it to types. The class keyword introduces both a value and a type,
// so what is the typeof a class? It depends on the context:

const v3 = typeof Cylinder; // Value is "function"
type T = typeof Cylinder; // Type is typeof Cylinder

// ** The right way using destructuring
function emailDestructuring({
	person,
	subject,
	body,
}: {
	person: Person3;
	subject: string;
	body: string;
}) {
	return null;
}

// ** Declaration with arrow function
const aPersion: Person[] = ['alice', 'bob', 'jan'].map((name): Person => ({ name }));

// ** Type assertion
var foo = {};
// foo.bar = 123; // 오류: 속성 'bar'가 `{}`에 존재하지 않음
// foo.bas = 'hello'; // 오류: 속성 'bar'가 `{}`에 존재하지 않음

// 위 코드는 에러를 발생시키는데 그 이유는 foo가 {}, 즉 속성이 하나도 없는 빈 객체로 타입 추론이 되었기 때문입니다. 그러므로 bar나 bas같은 속성을 foo에 추가할 수 없는 것입니다.
// 이런 문제는 as Foo라는 타입 표명을 사용해서 간단히 해결할 수 있습니다:

interface Foo {
	bar: number;
	bas: string;
}
var foo2 = {} as Foo;
foo2.bar = 123;
foo2.bas = 'hello';

// ** When to use type assertion?
document.querySelector('#myButton').addEventListener('click', (e) => {
	e.currentTarget; // Type is EventTarget
	const button = e.currentTarget as HTMLButtonElement;
	button; // Type is HTMLButtonElement
});
// Because TypeScript doesn’t have access to the DOM of your page, it has no way of knowing that #myButton is a button element.
// And it doesn’t know that the currentTarget of the event should be that same button
// You may also run into the non-null assertion, which is so common that it gets a special syntax:
const elNull = document.getElementById('foo'); // Type is HTMLElement | null
const el = document.getElementById('foo')!; // Type is HTMLElement
// Used as a prefix, ! is boolean negation. But as a suffix, ! is interpreted as an assertion that the value is non-null.
// You should treat ! just like any other assertion: it is erased during compilation, so you should only use it if you have information
// that the type checker lacks and can ensure that the value is non-null. If you can’t, you should use a conditional to check for the null case.

const body = document.body;
// const el2 = body as Person;
// ~~~~~~~~~~~~~~ Conversion of type 'HTMLElement' to type 'Person'
//                may be a mistake because neither type sufficiently
//                overlaps with the other. If this was intentional,
//                convert the expression to 'unknown' first

// ** Avoid TypeScript object wrapper types. Use the primitive types instead: string instead of String, number instead of Number,
// boolean instead of Boolean, symbol instead of Symbol, and bigint instead of BigInt.

interface Options {
	title: string;
	darkMode?: boolean;
}
function createWindow(options: Options) {
	if (options.darkMode) {
		return null;
	}
	// ...
}

// ****** Apply Types to Entire Function Expressions When Possible

function rollDice1(sides: number): number {
	return 0;
} // Statement
const rollDice2 = function (sides: number): number {
	return 0;
}; // Expression
const rollDice3 = (sides: number): number => {
	return 0;
}; // Also expression

// An advantage of function expressions in TypeScript is that you can apply a type declaration to the entire function at once,
// rather than specifying the types of the parameters and return type individually:
type DiceRollFn = (sides: number) => number;
const rollDice4: DiceRollFn = (sides) => {
	return 0;
};

type BinaryFn = (a: number, b: number) => number;
const addFn: BinaryFn = (a, b) => a + b;

// ** Write fetch function
async function checkedFetch1(input: RequestInfo, init?: RequestInit) {
	const response = await fetch(input, init); // init can be { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' } }
	if (!response.ok) {
		// Converted to a rejected Promise in an async function
		throw new Error('Request failed: ' + response.status);
	}
	return response;
}

// More coincisely
// apply type [typeof fetch] to the entire function to infer the types of input and init
const checkedFetch2: typeof fetch = async (input, init) => {
	const response = await fetch(input, init);
	if (!response.ok) {
		throw new Error('Request failed: ' + response.status);
	}
	return response;
};

// ** Interface and Type examples
interface IState {
	name: string;
	capital: string;
}

interface IDict {
	[key: string]: string;
}

interface IFunc {
	(x: number): string;
}

const toStrI: IFunc = (x) => '' + x;

interface IFnWithProperties {
	(x: number): number;
	prop: string;
}

// Generic
interface IPair<T> {
	first: T;
	second: T;
}

interface IStateWithPop extends IState {
	population: number;
}

class StateI implements IState {
	name: string = '';
	capital: string = '';
}

interface SampleInput {
	sampleInput: string;
}
interface SampleOutput {
	sampleOutput: string;
}
interface VariableMap {
	[name: string]: SampleInput | SampleOutput;
}
type NamedVariable = (SampleInput | SampleOutput) & { name: string };
const sampler: VariableMap = {
	name: {
		sampleOutput: 'asfd',
	},
};

// for tuple types TYPE is better
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];

// by interface do like this
interface ITuple1 {
	0: number;
	1: number;
	length: 2;
}
const t: ITuple1 = [10, 20];

// An interface does have some abilities that a type doesn’t, however. One of these is that an interface can be augmented
// This is known as “declaration merging,”
interface IStateAUG {
	name: string;
	capital: string;
}
interface IStateAUG {
	population: number;
}
const wyoming: IStateAUG = {
	name: 'Wyoming',
	capital: 'Cheyenne',
	population: 500_000,
}; // OK

// ****** Use Type Operations and Generics to Avoid Repeating Yourself
type HTTPFunction = (url: string, opts: Options) => Promise<Response>;
const get: HTTPFunction = (url, opts) => {
	return null;
};
const post: HTTPFunction = (url, opts) => {
	return null;
};

interface Person4 {
	firstName: string;
	lastName: string;
}

interface PersonWithBirthDate extends Person4 {
	birth: Date;
}

// What if you have a type, State, which represents the state of an entire application, and another, TopNavState, which represents just a part?
interface State {
	userId: string;
	pageTitle: string;
	recentFiles: string[];
	pageContents: string;
}
type TopNavStateWithState = {
	userId: State['userId'];
	pageTitle: State['pageTitle'];
	recentFiles: State['recentFiles'];
};
type TopNavState = {
	[k in 'userId' | 'pageTitle' | 'recentFiles']: State[k];
};

// Mapped types are the type system equivalent of looping over the fields in an array.
// This particular pattern is so common that it’s part of the standard library, where it’s called Pick
// type Pick<T, K> = { [k in K]: T[k] };
// Pick is an example of a generic type. Continuing the analogy to removing code duplication, using Pick is the equivalent of calling a function.
// Pick takes two types, T and K, and returns a third, much as a function might take two values and return a third.
type TopNavState2 = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;

//
interface SaveAction {
	type: 'save';
	// ...
}
interface LoadAction {
	type: 'load';
	// ...
}
type Action = SaveAction | LoadAction;
// type ActionType = 'save' | 'load'; // Repeated types!
type ActionType = Action['type']; // Type is "save" | "load"
// As you add more types to the Action union, ActionType will incorporate them automatically.
// This type is distinct from what you’d get using Pick, which would give you an interface with a type property:
type ActionRec = Pick<Action, 'type'>; // { type: "save" | "load" }

// If you’re defining a class which can be initialized and later updated, the type for the parameter to the update method
// will optionally include most of the same parameters as the constructor:
interface Options {
	width: number;
	height: number;
	color: string;
	label: string;
}
interface OptionsUpdate {
	width?: number;
	height?: number;
	color?: string;
	label?: string;
}
class UIWidget {
	constructor(init: Options) {
		/* */
	}
	update(options: OptionsUpdate) {
		/* */
	}
}

// You can construct OptionsUpdate from Options using a mapped type and keyof:
type OptionsUpdate2 = { [k in keyof Options]?: Options[k] };
// keyof takes a type and gives you a union of the types of its keys:
type OptionsKeys = keyof Options;
// Type is "width" | "height" | "color" | "label"

// The ? makes each property optional. This pattern is also extremely common and is included in the standard library as Partial:
class UIWidget2 {
	constructor(init: Options) {
		/* */
	}
	update(options: Partial<Options>) {
		/* */
	}
}

// You may want to create a named type for the inferred return value of a function or method:
function getUserInfo(userId: string) {
	// ...
	return {
		userId,
		name: 'asdf',
		age: 123,
		height: 123,
		weight: 123,
		favoriteColor: 'black',
	};
}
// Return type inferred as { userId: string; name: string; age: number, ... }

// ** Generic types are the equivalent of functions for types. And functions are the key to DRY for logic. So it should come as no surprise
// that generics are the key to DRY for types. But there’s a missing piece to this analogy. You use the type system to constrain the values
// you can map with a function: you add numbers, not objects; you find the area of shapes, not database records. How do you constrain the
// parameters in a generic type?
// => You do so with extends. You can declare that any generic parameter extends a type. For example:
interface Name {
	first: string;
	last: string;
}
type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
	{ first: 'Fred', last: 'Astraire' },
	{ first: 'Ginger', last: 'Rogers' },
];
// const couple2: DancingDuo<{ first: string }> = [
// 	// ~~~~~~~~~~~~~~~
// 	// Property 'last' is missing in type
// 	// '{ first: string; }' but required in type 'Name'
// 	{ first: 'Sonny' },
// 	{ first: 'Cher' },
// ];

// At the moment, TypeScript always requires you to write out the generic parameter in a declaration. Writing DancingDuo instead of DancingDuo<Name>
// won’t cut it. If you want TypeScript to infer the type of the generic parameter, you can use a carefully typed identity function:
const dancingDuo2 = <T extends Name>(x: DancingDuo<T>) => x;
const couple11 = dancingDuo2([
	{ first: 'Fred', last: 'Astaire' },
	{ first: 'Ginger', last: 'Rogers' },
]);
// const couple22 = dancingDuo2([
// 	{ first: 'Bono' },
// 	// ~~~~~~~~~~~~~~
// 	{ first: 'Prince' },
// 	// ~~~~~~~~~~~~~~~~
// 	//     Property 'last' is missing in type
// 	//     '{ first: string; }' but required in type 'Name'
// ]);

// Pick is declared like this
// type Pick<T, K extends keyof T> = {
//   [k in K]: T[k]
// };  // OK
type FirstLast = Pick<Name, 'first' | 'last'>; // OK
// type FirstMiddle = Pick<Name, 'first' | 'middle'>;
//                            // ~~~~~~~~~~~~~~~~~~
//                            // Type '"middle"' is not assignable
//                            // to type '"first" | "last"'

// ****** Use Index Signatures for Dynamic Data

type Rocket = { [property: string]: string };
const rocket: Rocket = {
	name: 'Falcon 9',
	variant: 'Block 5',
	thrust: '7,607 kN',
};
// Downside
// It allows any keys, including incorrect ones. Had you written Name instead of name, it would have still been a valid Rocket type.
// It doesn’t require any specific keys to be present. {} is also a valid Rocket.
// It cannot have distinct types for different keys. For example, thrust should probably be a number, not a string.
// TypeScript’s language services can’t help you with types like this. As you’re typing name:, there’s no autocomplete because the key could be anything.
// use the following

interface Rocket2 {
	name: string;
	variant: string;
	thrust_kN: number;
}

type Vec3D_1 = Record<'x' | 'y' | 'z', number>;
// Type Vec3D = {
//   x: number;
//   y: number;
//   z: number;
// }
type Vec3D_2 = { [k in 'x' | 'y' | 'z']: number };
// Same as above
type ABC = { [k in 'a' | 'b' | 'c']: k extends 'b' ? string : number };
// Type ABC = {
//   a: number;
//   b: string;
//   c: number;
// }

// ****** Use readonly to Avoid Errors Associated with Mutation

// Because of pop the original arr will be emptied
function arraySum_Emptied(arr: number[]) {
	let sum = 0,
		num;
	while ((num = arr.pop()) !== undefined) {
		sum += num;
	}
	return sum;
}

// Use readonly to prevent mutation
function arraySum(arr: readonly number[]) {
	let sum = 0,
		num;
	// while ((num = arr.pop()) !== undefined) {
	// 	// ~~~ 'pop' does not exist on type 'readonly number[]'
	// 	sum += num;
	// }
	return sum;
}

// ** Difference between readonly number[] and number[]

// 1. You can read from its elements, but you can’t write to them.
// 2. You can read its length, but you can’t set it (which would mutate the array).
// 3. You can’t call pop or other methods that mutate the array.

const a: number[] = [1, 2, 3];
const b: readonly number[] = a;
// const c: number[] = b;
//    // ~ Type 'readonly number[]' is 'readonly' and cannot be
//    //   assigned to the mutable type 'number[]'

interface Outer {
	inner: {
		x: number;
	};
}
const o: Readonly<Outer> = { inner: { x: 0 } };
// o.inner = { x: 1 }; // err
// ~~~~ Cannot assign to 'inner' because it is a read-only property
o.inner.x = 1; // OK

let obj: { readonly [k: string]: number } = {};
// Or Readonly<{[k: string]: number}
// obj.hi = 45; // err
//  ~~ Index signature in type ... only permits reading
obj = { ...obj, hi: 12 }; // OK
obj = { ...obj, bye: 34 }; // OK

// ****** Use Mapped Types to Keep Values in Sync

interface ScatterProps {
	// The data
	xs: number[];
	ys: number[];

	// Display
	xRange: [number, number];
	yRange: [number, number];
	color: string;

	// Events
	onClick: (x: number, y: number, index: number) => void;
}
