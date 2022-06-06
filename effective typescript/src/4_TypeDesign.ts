// ****** Prefer Types That Always Represent Valid States

interface State {
	pageText: string;
	isLoading: boolean;
	error?: string;
}

const currentPage = 'asdf';

// What if isLoading and error are both set? What would that mean? Is it better to display the
// loading message or the error message? It’s hard to say! There’s not enough information available.
function renderPage(state: State) {
	if (state.error) {
		return `Error! Unable to load ${currentPage}: ${state.error}`;
	} else if (state.isLoading) {
		return `Loading ${currentPage}...`;
	}
	return `<h1>${currentPage}</h1>\n${state.pageText}`;
}

const getUrlForPage = (str: string): string => {
	return 'asfd';
};

async function changePage(state: State, newPage: string) {
	state.isLoading = true;
	try {
		const response = await fetch(getUrlForPage(newPage));
		if (!response.ok) {
			throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
		}
		const text = await response.text();
		state.isLoading = false;
		state.pageText = text;
	} catch (e) {
		state.error = '' + e;
	}
}

// There are many problems with this! Here are a few:
// We forgot to set state.isLoading to false in the error case.
// We didn’t clear out state.error, so if the previous request failed, then you’ll keep seeing that error message instead of a loading message.
// If the user changes pages again while the page is loading, who knows what will happen. They might see a new page and then an error, or the first page and not the second depending on the order in which the responses come back.

interface RequestPending {
	state: 'pending';
}

interface RequestError {
	state: 'error';
	error: string;
}

interface RequestSuccess {
	state: 'ok';
	pageText: string;
}

type RequestState = RequestPending | RequestError | RequestSuccess;

interface State44 {
	currentPage: string;
	requests: { [page: string]: RequestState }; // tagged union (also known as a “discriminated union”)
}
// his version of the state is three to four times longer, but it has the enormous advantage
// of not admitting invalid states. The current page is modeled explicitly, as is the state of
// every request that you issue. As a result, the renderPage and changePage functions are easy to implement:

function renderPage_Answer(state: State44) {
	const { currentPage } = state;
	const requestState = state.requests[currentPage];
	switch (requestState.state) {
		case 'pending':
			return `Loading ${currentPage}...`;
		case 'error':
			return `Error! Unable to load ${currentPage}: ${requestState.error}`;
		case 'ok':
			return `<h1>${currentPage}</h1>\n${requestState.pageText}`;
	}
}

async function changePage_Answer(state: State44, newPage: string) {
	state.requests[newPage] = { state: 'pending' };
	state.currentPage = newPage;
	try {
		const response = await fetch(getUrlForPage(newPage));
		if (!response.ok) {
			throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
		}
		const pageText = await response.text();
		state.requests[newPage] = { state: 'ok', pageText };
	} catch (e) {
		state.requests[newPage] = { state: 'error', error: '' + e };
	}
}
// The ambiguity from the first implementation is entirely gone: it’s clear what the
// current page is, and every request is in exactly one state. If the user changes the
// page after a request has been issued, that’s no problem either. The old request still completes,
// but it doesn’t affect the UI.

// ****** Be Liberal in What You Accept and Strict in What You Produce
type LngLat = { lgn: number; lat: number } | { lon: number; lat: number } | [number, number];

interface CameraOptions {
	center?: LngLat;
	zoom?: number;
	bearing?: number;
	pitch?: number;
}

type LngLatBounds =
	| { northeast: LngLat; southwest: LngLat }
	| [LngLat, LngLat]
	| [number, number, number, number];

function calculateBoundingBox(f: Feature): BoundingBox | null {
	let box: BoundingBox | null = null;

	const helper = (coords: any[]) => {
		// ...
	};

	const { geometry } = f;
	if (geometry) {
		helper(geometry.coordinates);
		// ~~~~~~~~~~~
		// Property 'coordinates' does not exist on type 'Geometry'
		//   Property 'coordinates' does not exist on type
		//   'GeometryCollection'
	}

	return box;
}

declare function setCamera(camera: CameraOptions): void;
declare function viewportForBounds(bounds: LngLatBounds): CameraOptions;

// function focusOnFeature(f: Feature) {
// 	const bounds = calculateBoundingBox(f);
// 	const camera = viewportForBounds(bounds);
// 	setCamera(camera);
// 	const {
// 		center: { lat, lng },
// 		zoom,
// 	} = camera;
// 	// ~~~      Property 'lat' does not exist on type ...
// 	//      ~~~ Property 'lng' does not exist on type ...
// 	zoom; // Type is number | undefined
// 	window.location.search = `?v=@${lat},${lng}z${zoom}`;
// }

// Whoops! Only the zoom property exists, but its type is inferred as number|undefined, which is
// also problematic. The issue is that the type declaration for viewportForBounds indicates that
// it is liberal not just in what it accepts but also in what it produces. The only type-safe way to
// use the camera result is to introduce a code branch for each component of the union type

// The return type with lots of optional properties and union types makes viewportForBounds difficult
// to use. Its broad parameter type is convenient, but its broad return type is not. A more convenient
// API would be strict in what it produces

// One way to do this is to distinguish a canonical format for coordinates. Following JavaScript’s
// convention of distinguishing “Array” and “Array-like”, you can draw a distinction between
// LngLat and LngLatLike. You can also distinguish between a fully defined Camera type and the partial
// version accepted by setCamera:

interface LngLat44 {
	lng: number;
	lat: number;
}
type LngLatLike44 = LngLat | { lon: number; lat: number } | [number, number];

interface Camera44 {
	center: LngLat44;
	zoom: number;
	bearing: number;
	pitch: number;
}

interface CameraOptions44 extends Omit<Partial<Camera44>, 'center'> {
	center?: LngLatLike44;
}

type LngLatBounds44 =
	| { northeast: LngLatLike44; southeast: LngLatLike44 }
	| [LngLatLike44, LngLatLike44]
	| [number, number, number, number];

declare function setCamera44(camera: CameraOptions44): void;
declare function viewportForBounds44(bounds: LngLatBounds44): CameraOptions44;

// Using Partial<Camera> as the parameter type in setCamera would not work here since you do want to
// allow LngLatLike objects for the center property. And you can’t write "CameraOptions extends Partial<Camera>"
// since LngLatLike is a superset of LngLat, not a subset (Item 7). If this seems too complicated,
// you could also write the type out explicitly at the cost of some repetition:

interface CameraOptions45 {
	center?: LngLatLike44;
	zoom?: number;
	bearing?: number;
	pitch?: number;
}

function focusOnFeature45(f: Feature) {
	const bounds = calculateBoundingBox(f);
	const camera = viewportForBounds44(bounds);
	setCamera44(camera);
	const {
		center: { lat, lng },
		zoom,
	} = camera; // OK?
	zoom; // Type is number
	window.location.search = `?v=@${lat},${lng}z${zoom}`;
}

// ****** Push Null Values to the Perimeter of Your Types

function extent(nums: number[]) {
	let min, max;
	for (const num of nums) {
		if (!min) {
			min = num;
			max = num;
		} else {
			min = Math.min(min, num);
			max = Math.max(max, num);
			// ~~~ Argument of type 'number | undefined' is not
			//     assignable to parameter of type 'number'
			// Turning on strictNullChecks makes both of these issues more apparent:
		}
	}
	return [min, max];
}

// The code type checks (without strictNullChecks) and has an inferred return type of number[], which seems
// fine. But it has a bug and a design flaw:
// If the min or max is zero, it may get overridden. For example, extent([0, 1, 2]) will return [1, 2] rather than [0, 2].
// If the nums array is empty, the function will return [undefined, undefined]. This sort of object with several undefineds
// will be difficult for clients to work with and is exactly the sort of type that this item discourages. We know from reading
// the source code that min and max will either both be undefined or neither, but that information isn’t represented in the type system.

// A better solution is to put the min and max in the same object and make this object either fully null or fully non-null:
function extent4(nums: number[]) {
	let result: [number, number] | null = null;
	for (const num of nums) {
		if (!result) {
			result = [num, num];
		} else {
			result = [Math.min(num, result[0]), Math.max(num, result[1])];
		}
	}
	return result;
}

// A mix of null and non-null values can also lead to problems in classes. For instance, suppose you have a class
// that represents both a user and their posts on a forum
interface UserInfo {
	name: string;
}
interface Post {
	content: string;
}
function fetchUser(userId: string) {
	return null;
}
function fetchPostsForUser(userId: string) {
	return null;
}
class UserPosts {
	user: UserInfo | null;
	posts: Post[] | null;

	constructor() {
		this.user = null;
		this.posts = null;
	}

	async init(userId: string) {
		return Promise.all([
			async () => (this.user = await fetchUser(userId)),
			async () => (this.posts = await fetchPostsForUser(userId)),
		]);
	}
}
// While the two network requests are loading, the user and posts properties will be null. At any time, they might both be null,
// one might be null, or they might both be non-null. There are four possibilities. This complexity will seep into every method on
// the class. This design is almost certain to lead to confusion, a proliferation of null checks, and bugs.

// A better design would wait until all the data used by the class is available:
class UserPosts4 {
	user: UserInfo;
	posts: Post[];

	constructor(user: UserInfo, posts: Post[]) {
		this.user = user;
		this.posts = posts;
	}

	static async init(userId: string): Promise<UserPosts4> {
		const [user, posts] = await Promise.all([fetchUser(userId), fetchPostsForUser(userId)]);
		return new UserPosts4(user, posts);
	}
}

// Now the UserPosts class is fully non-null, and it’s easy to write correct methods on it. Of course, if you need to perform
// operations while data is partially loaded, then you’ll need to deal with the multiplicity of null and non-null states.
// (Don’t be tempted to replace nullable properties with Promises. This tends to lead to even more confusing code and forces all
// your methods to be async. Promises clarify the code that loads data but tend to have the opposite effect on the class that uses that data.)

// ****** Prefer Unions of Interfaces to Interfaces of Unions

interface Layer {
	type: 'fill' | 'line' | 'point';
	layout: FillLayout | LineLayout | PointLayout;
	paint: FillPaint | LinePaint | PointPaint;
}
// dont use this but use below version
interface FillLayer {
	type: 'fill';
	layout: FillLayout;
	paint: FillPaint;
}
interface LineLayer {
	type: 'line';
	layout: LineLayout;
	paint: LinePaint;
}
interface PointLayer {
	type: 'paint';
	layout: PointLayout;
	paint: PointPaint;
}
type Layer2 = FillLayer | LineLayer | PointLayer;

interface Person44 {
	name: string;
	birth?: {
		place: string;
		date: Date;
	};
}

function eulogize(p: Person44) {
	console.log(p.name);
	const { birth } = p;
	if (birth) {
		console.log(`was born on ${birth.date} in ${birth.place}.`);
	}
}

interface Name45 {
	name: string;
}

interface PersonWithBirth45 extends Name45 {
	placeOfBirth: string;
	dateOfBirth: Date;
}

type Person45 = Name45 | PersonWithBirth45;

function eulogize45(p: Person45) {
	if ('placeOfBirth' in p) {
		p; // Type is PersonWithBirth
		const { dateOfBirth } = p; // OK, type is Date
	}
}

// ****** Prefer More Precise Alternatives to String Types
interface Album_badVersion {
	artist: string;
	title: string;
	releaseDate: string; // YYYY-MM-DD
	recordingType: string; // E.g., "live" or "studio"
}
const kindOfBlue: Album_badVersion = {
	artist: 'Miles Davis',
	title: 'Kind of Blue',
	releaseDate: 'August 17th, 1959', // Oops!
	recordingType: 'Studio', // Oops!
}; // OK

type RecordingType = 'studio' | 'live';

interface Album_betterVersion {
	artist: string;
	title: string;
	releaseDate: Date;
	recordingType: RecordingType;
}

const kindOfBlue44: Album_betterVersion = {
	artist: 'Miles Davis',
	title: 'Kind of Blue',
	releaseDate: new Date('1959-08-17'),
	recordingType: 'studio',
	// ~~~~~~~~~~~~ Type '"Studio"' is not assignable to type 'RecordingType'
};

function pluck_badversion(records: any[], key: string): any[] {
	return records.map((r) => r[key]);
}

function pluck_betterversion<T>(records: T[], key: string): any[] {
	return records.map((r) => r[key]);
	// ~~~~~~ Element implicitly has an 'any' type
	//        because type '{}' has no index signature
}

// TypeScript is now complaining that the string type for key is too broad. And it’s right to do so: if you pass in an array of
// Albums then there are only four valid values for key (“artist,” “title,” “releaseDate,” and “recordingType”), as opposed to the
// vast set of strings. This is precisely what the keyof Album type is

type K = keyof Album_betterVersion;
// Type is "artist" | "title" | "releaseDate" | "recordingType"

function pluck_morebetterversion<T>(records: T[], key: keyof T) {
	return records.map((r) => r[key]);
}
const albums: Album_betterVersion[] = [
	{
		artist: 'asdf',
		title: 'title',
		releaseDate: new Date('2022-05-04'),
		recordingType: 'studio',
	},
];
const releaseDates = pluck_morebetterversion(albums, 'releaseDate'); // Type is (string | Date)[]
// The type should be Date[], not (string | Date)[]. While keyof T is much narrower than string, it’s still too broad.
// To narrow it further, we need to introduce a second generic parameter that is a subset of keyof T (probably a single value):
function pluck_bestversion<T, K extends keyof T>(records: T[], key: K): T[K][] {
	return records.map((r) => r[key]);
}
const releaseDates2 = pluck_bestversion(albums, 'releaseDate');

// ****** Prefer Incomplete Types to Inaccurate Types
interface Point {
	type: 'Point';
	coordinates: number[];
}
interface LineString {
	type: 'LineString';
	coordinates: number[][];
}
interface Polygon {
	type: 'Polygon';
	coordinates: number[][][];
}
type Geometry = Point | LineString | Polygon; // Also several others

// This is fine, but number[] for a coordinate is a bit imprecise. Really these are latitudes and longitudes, so perhaps a tuple type would be better:
type GeoPosition = [number, number];
interface Point44 {
	type: 'Point';
	coordinates: GeoPosition;
}

// ****** Name Types Using the Language of Your Problem Domain

interface Animal {
	name: string;
	endangered: boolean;
	habitat: string;
}

const leopard: Animal = {
	name: 'Snow Leopard',
	endangered: false,
	habitat: 'tundra',
};
// There are a few issues here:
// name is a very general term. What sort of name are you expecting? A scientific name? A common name?
// The boolean endangered field is also ambiguous. What if an animal is extinct? Is the intent here “endangered or worse?” Or does it literally mean endangered?
// The habitat field is very ambiguous, not just because of the overly broad string type (Item 33) but also because it’s unclear what’s meant by “habitat.”
// The variable name is leopard, but the value of the name property is “Snow Leopard.” Is this distinction meaningful?

interface Animal44 {
	commonName: string;
	genus: string;
	species: string;
	status: ConservationStatus;
	climates: KoppenClimate[];
}
type ConservationStatus = 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC';
type KoppenClimate =
	| 'Af'
	| 'Am'
	| 'As'
	| 'Aw'
	| 'BSh'
	| 'BSk'
	| 'BWh'
	| 'BWk'
	| 'Cfa'
	| 'Cfb'
	| 'Cfc'
	| 'Csa'
	| 'Csb'
	| 'Csc'
	| 'Cwa'
	| 'Cwb'
	| 'Cwc'
	| 'Dfa'
	| 'Dfb'
	| 'Dfc'
	| 'Dfd'
	| 'Dsa'
	| 'Dsb'
	| 'Dsc'
	| 'Dwa'
	| 'Dwb'
	| 'Dwc'
	| 'Dwd'
	| 'EF'
	| 'ET';
const snowLeopard: Animal44 = {
	commonName: 'Snow Leopard',
	genus: 'Panthera',
	species: 'Uncia',
	status: 'VU', // vulnerable
	climates: ['ET', 'EF', 'Dfd'], // alpine or subalpine
};
// name has been replaced with more specific terms: commonName, genus, and species.
// endangered has become status, a ConservationStatus type which uses a standard classification system from the IUCN.
// habitat has become climates and uses another standard taxonomy, the Köppen climate classification.
