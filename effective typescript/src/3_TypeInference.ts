// // Don't do this:
// app.get("/health", (request: express.Request, response: express.Response) => {
//   response.send("OK");
// });

// // Do this:
// app.get("/health", (request, response) => {
//   response.send("OK");
// });

interface Product {
	id: string;
	name: string;
	price: number;
}

function logProduct(product: Product) {
	const id: string = product.id;
	const name: string = product.name;
	const price: number = product.price;
	console.log(id, name, price);
}

function logProduct_betterway(product: Product) {
	const { id, name, price } = product;
	console.log(id, name, price);
}

// ** You decide to add a cache to avoid duplicating network requests:
const cache: { [ticker: string]: number } = {
	id: 1,
	qwer: 3,
};
function getQuote(ticker: string) {
	if (ticker in cache) {
		return cache[ticker];
	}
	return fetch(`https://quotes.example.com/?q=${ticker}`)
		.then((response) => response.json())
		.then((quote) => {
			cache[ticker] = quote;
			return quote;
		});
}

// ** Understand Type Widening

interface Vector3 {
	x: number;
	y: number;
	z: number;
}
function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
	return vector[axis];
}

let x = 'x';
let vec = { x: 10, y: 20, z: 30 };
// getComponent(vec, x);
// ~ Argument of type 'string' is not assignable to
//   parameter of type '"x" | "y" | "z"'

// The issue is that x’s type is inferred as string, whereas the getComponent function expected a more specific type
// for its second argument. This is widening at work, and here it has led to an error

// TypeScript gives you a few ways to control the process of widening. One is const. If you declare a variable with
// const instead of let, it gets a narrower type. In fact, using const fixes the error in our original example:
const y = 'y';
getComponent(vec, y);
// Because x cannot be reassigned, TypeScript is able to infer a narrower type without risk of
// inadvertently flagging errors on subsequent assignments.

const vv33: { x: 1 | 3 | 5 } = {
	x: 1,
}; // Type is { x: 1 | 3 | 5; }

const vv1 = {
	x: 1,
	y: 2,
}; // Type is { x: number; y: number; }

const vv2 = {
	x: 1 as const,
	y: 2,
}; // Type is { x: 1; y: number; }

const vv3 = {
	x: 1,
	y: 2,
}; // Type is { readonly x: 1; readonly y: 2; }

const aa1 = [1, 2, 3]; // Type is number[]
const aa2 = [1, 2, 3] as const; // Type is readonly [1, 2, 3]

// ** Understand Type Narrowing

// There are many ways that you can narrow a type. Using instanceof works:
function contains_3(text: string, search: string | RegExp) {
	if (search instanceof RegExp) {
		search; // Type is RegExp
		return !!search.exec(text);
	}
	search; // Type is string
	return text.includes(search);
}

// So does a property check:
interface AA {
	a: number;
}
interface BB {
	b: number;
}
function pickAB(ab: AA | BB) {
	if ('a' in ab) {
		ab; // Type is A
	} else {
		ab; // Type is B
	}
	ab; // Type is A | B
}

// Some built-in functions such as Array.isArray are able to narrow types:
function contains_4(text: string, terms: string | string[]) {
	const termList = Array.isArray(terms) ? terms : [terms];
	termList; // Type is string[]
	// ...
}

interface UploadEvent {
	type: 'upload';
	filename: string;
	contents: string;
}
interface DownloadEvent {
	type: 'download';
	filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent_3(e: AppEvent) {
	switch (e.type) {
		case 'download':
			e; // Type is DownloadEvent
			break;
		case 'upload':
			e; // Type is UploadEvent
			break;
	}
}
// This pattern is known as a “tagged union” or “discriminated union,” and it is ubiquitous in TypeScript.

// If TypeScript isn’t able to figure out a type, you can even introduce a custom function to help it out:
function isInputElement(el: HTMLElement): el is HTMLInputElement {
	return 'value' in el;
}

function getElementContent(el: HTMLElement) {
	if (isInputElement(el)) {
		el; // Type is HTMLInputElement
		return el.value;
	}
	el; // Type is HTMLElement
	return el.textContent;
}
// This is known as a “user-defined type guard.” The el is HTMLInputElement as a return type tells the
// type checker that it can narrow the type of the parameter if the function returns true.

const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
const members = ['Janet', 'Michael'].map((who) => jackson5.find((n) => n === who)); // Typs is (string | undefined)

// Use typeguard
function isDefined<T>(x: T | undefined): x is T {
	return x !== undefined;
}

const memberss = ['Janet', 'Michael']
	.map((who) => jackson5.find((n) => n === who))
	.filter(isDefined);

// ****** Create Objects All at Once
interface Point33 {
	x: number;
	y: number;
}

// Defining the object all at once is good way
const pt1 = {
	x: 3,
	y: 4,
};

// If you must build the object piecemeal, you may use a type assertion (as) to silence the type checker:
const pt2 = {} as Point33;
pt2.x = 3;
pt2.y = 4;

// But the better way is by building the object all at once and using a declaration
const pt3: Point = {
	x: 3,
	y: 4,
};

const id3 = { name: 'Pythagoras' };
const namedPoint = { ...pt3, ...id3 };

// To conditionally add a property in a type-safe way, you can use spread syntax with null or {}, which add no properties:
declare let hasMiddle: boolean;
const firstLast = { first: 'Harry', last: 'Truman' };
const president = { ...firstLast, ...(hasMiddle ? { middle: 'S' } : {}) };

declare let hasDates: boolean;
const nameTitle = { name: 'Khufu', title: 'Pharaoh' };
const pharaoh = {
	...nameTitle,
	...(hasDates && { start: -2589, end: -2566 }),
};

// ** Use async Functions Instead of Callbacks for Asynchronous Code

const _cache: { [url: string]: string } = {};
async function fetchWithCache(url: string) {
	if (url in _cache) {
		return _cache[url];
	}
	const response = await fetch(url);
	const text = await response.text();
	_cache[url] = text;
	return text;
}

let requestStatus: 'loading' | 'success' | 'error';
async function getUser(userId: string) {
	requestStatus = 'loading';
	const profile = await fetchWithCache(`/user/${userId}`);
	requestStatus = 'success';
}

// Function getJSON(url: string): Promise<any>
async function getJSON(url: string) {
	const response = await fetch(url);
	const jsonPromise = response.json(); // Type is Promise<any>
	return jsonPromise;
}

// ****** Understand How Context Is Used in Type Inference

type Language = 'JavaScript' | 'TypeScript' | 'Python';
function setLanguage(language: Language) {
	/* ... */
}

setLanguage('JavaScript'); // OK

let language = 'JavaScript';
// setLanguage(language);
// ~~~~~~~~ Argument of type 'string' is not assignable
//          to parameter of type 'Language'

// What went wrong? With the inline form, TypeScript knows from the function declaration that
// the parameter is supposed to be of type Language. The string literal 'JavaScript' is assignable
// to this type, so this is OK. But when you factor out a variable, TypeScript must infer its type at
// the time of assignment. In this case it infers string, which is not assignable to Language. Hence the error.

// 2 ways to solve
let language2: Language = 'JavaScript';
setLanguage(language2); // OK

const language3 = 'JavaScript';
setLanguage(language3); // OK

// Parameter is a (latitude, longitude) pair.
function panTo(where: [number, number]) {
	/* ... */
}

panTo([10, 20]); // OK

const loc = [10, 20];
// panTo(loc);
//    ~~~ Argument of type 'number[]' is not assignable to
//        parameter of type '[number, number]'

const loc2: [number, number] = [10, 20];
panTo(loc2); // ok
const loc3 = [10, 20] as const;
// panTo(loc3);
// ~~~ Type 'readonly [10, 20]' is 'readonly'
//     and cannot be assigned to the mutable type '[number, number]'
function panto2(where: readonly [number, number]) {
	/* ... */
}
panto2(loc3); // ok

type Language3 = 'JavaScript' | 'TypeScript' | 'Python';
interface GovernedLanguage {
	language: Language3;
	organization: string;
}

function complain(language: GovernedLanguage) {
	/* ... */
}

complain({ language: 'TypeScript', organization: 'Microsoft' }); // OK

const ts = {
	language: 'TypeScript',
	organization: 'Microsoft',
};
// complain(ts);
//       ~~ Argument of type '{ language: string; organization: string; }'
//            is not assignable to parameter of type 'GovernedLanguage'
//          Types of property 'language' are incompatible
//            Type 'string' is not assignable to type 'Language'

function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
	fn(Math.random(), Math.random());
}

callWithRandomNumbers((a, b) => {
	a; // Type is number
	b; // Type is number
	console.log(a + b);
});

const fn = (a, b) => {
	// ~    Parameter 'a' implicitly has an 'any' type
	//    ~ Parameter 'b' implicitly has an 'any' type
	console.log(a + b);
};
callWithRandomNumbers(fn);

const fn2 = (a: number, b: number) => {
	console.log(a + b);
};
callWithRandomNumbers(fn2);
