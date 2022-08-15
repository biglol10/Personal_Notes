// https://github.com/ZeroCho/ts-all-in-one/blob/main/README.md

/** ****************************************************************************************
 * @설명 : 1. 타입스크립트는 변수, 매개변수, 리턴값에 타입 붙이는 것
 ********************************************************************************************
 * 기본 문법 배우기_1: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122314?tab=curriculum
********************************************************************************************/

const a: string = 'asdf';
const b: number = 5;
const c: boolean = true;
const d: undefined = undefined;
const e: null = null;
const f: symbol = Symbol.for('asdf');
// const g: bigint = 100000n;
const constVal: 5 = 5;
const constVal2: true = true;

function add(x: number, y: number): number {return x+y};
const add2: (x:number, y: number) => number = (x,y) => x+y;

type Add = (x: number, y: number) => number;
const add3: Add = (x, y) => x+y;

interface IAdd {
    (x: number, y: number): number;
}

const add4: IAdd = (x, y) => x+y;

const arr: string[] = ['safd','qwr'];
const arr2: Array<string> = ['xzvc', 'sadf']; // <> 은 generic
const arr3: [number, number, string] = [123,234,'wqer']; // tuple

const obj: {lat: number, lon: number} = {lat:123, lon:123};


/** ****************************************************************************************
 * @설명 : 2. 타입추론을 적극적으로 활용하자
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122315?tab=curriculum
********************************************************************************************/

const a2: string = '5'; // 는 잘못된 코드이다... 타입은 최대한 정확해야 하는데 :string을 안 적었으면 a2는 '5'라는 타입을 가졌겠지만
                        // :string을 적어줌으로써 문자열 타입으로 변환되었다

// 타입을 지워보고 마우스 올렸을 때 타입이 제대로 추론되면 냅두고 제대로 되지 않으면 명시적으로 써주자


/** ****************************************************************************************
 * @설명 : 3. js 변환 시 사라지는 부분을 파악하자
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122316?tab=curriculum
********************************************************************************************/

// 타입선언한 부분들은 다 사라질 것임
// function add5(x: number, y: number): number;
// function add5(x, y) {
//     return x + y;
// }


/** ****************************************************************************************
 * @설명 : 4. never 타입과 느낌표(non-null assertion)
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122316?tab=curriculum
********************************************************************************************/

try{
    // const array = [];  // 빈 배열 선언하면 never[]... 아무 타입도 올 수 없기 때문에 미리 타입선언
    const array: string[] = [];
    array.push('sfad');
} catch(error){
    error;
}

const head = document.querySelector('#head');
if(head){
    head.innerHTML = 'hello world';
    console.log(head);
}

// head id가 무조건 있다는걸 알 땐 ! 붙이기 (null이나 undefined가 아닌음 보증... 다만 비추함)
const head2 = document.querySelector('#head')!;


/** ****************************************************************************************
 * @설명 : 5. 원시 래퍼 타입, 템플릿 리터럴 타입, rest, 튜플
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122318?tab=curriculum
********************************************************************************************/

// 대문자 String 타입은 new String() 타입인데 이걸 잘 쓰지 않으니 소문자

type World = 'world' | 'hell';
const aa5: World = 'world';

// type Greeting = 'hello world';
type Greeting = `hello ${World}`;
const cc5: Greeting = 'hello world'; // hello hell도 가능

function rest(...args: string[]){
    console.log(args);
}

rest('1','2','3'); // ['1', '2', '3'];

const tuple5: [string, number] = ['1', 1];
// tuple5[2] = 'asdf'; // 얘는 막아주지만
tuple5.push('asfd'); // 얘는 못 막아줌


/** ****************************************************************************************
 * @설명 : 6. enum, keyof, typeof
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122319?tab=curriculum
********************************************************************************************/

const enum EDirection {
    Up = 3,  // 값 지정 안 해주면 0이고 나머지는 1씩 증가
    Down,
    Left,
    Right
}

const a6 = EDirection.Up; 
const a66 = EDirection.Down;

// ENUM 대신 객체를 더 많이 씀
const ODirection = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
} as const;  // as const 안 쓰면 Up, Down이 number로 됨

function walk6(dir: EDirection){};

// This requires an extra line to pull out the keys (Enum 안 쓰게 된다면...)
type Direction = typeof ODirection[keyof typeof ODirection];
function run6(dir: Direction) {};
walk6(EDirection.Up);
run6(ODirection.Up);

// Key만 뽑아오고 싶을 때
const obj6 = { a: '123', b: '324', c: '234'};
type Key6 = keyof typeof obj6;

// value 타입 뽑아오고 싶을 때
const obj66 = { a: '123', b: '324', c: '234'} as const;
type Key66 = typeof obj66[keyof typeof obj66]; // '123' | '324' | '234'


/** ****************************************************************************************
 * @설명 : 7. union(|)과 intersection(&)
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122320?tab=curriculum
********************************************************************************************/

// ! 이거 자체가 잘못됏음
// function add7(x: string | number, y: string | number): string | number { return x + y };
// const result: string | number = add(1,2); // string | number이니 string에만 있는 함수를 쓸 수도 있다고 판단함 => 에러
// 처음 타입을 잘 잡아야 함

type A7 = {hello: 'world'} &  {name: 'biglol'}; // 모든 속성이 다 있어야 한다
const a7: A7 = {hello: 'world', name: 'biglol'};
type A77 = {hello: 'world'} | {name: 'biglol'}; // 하나만 있어도 된다
const a77: A77 = {hello: 'world', name: 'biglol'};


/** ****************************************************************************************
 * @설명 : 8. 타입 애일리어스와 인터페이스의 상속(extends)
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122321?tab=curriculum
********************************************************************************************/

type Animal8 = {breath: true};
type Mamal8 = Animal8 & {breed: true};
type Human8 = Mamal8 & {think: true};

const biglol8: Human8 = {think: true, breath: true, breed: true};

interface Animal88 {
    breath: true;
}
interface Mamal88 extends Animal88 {
    breed: true;
}
interface Human88 extends Mamal88 {
    think: true;
}

// 인터페이스는 여러번 선언이 가능하고 할 때마다 합쳐짐
interface A8 {
    talk: () => void;
}
interface A8 {
    eat: () => void;
}
const a888: A8 = {talk() {}, eat() {}};



/** ****************************************************************************************
 * @설명 : 9. 타입을 집합으로 생각하자(좁은 타입과 넓은 타입)
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122305?tab=curriculum
********************************************************************************************/

// 객체는 덜 상세할 수록 더 넒음
// 다른 것들은 상세할 수록 더 넒음
const a9: string | number = 'afsd';
const a99: string = 'asdf'; // a9 이 더 넓음

const obj9 = {name: 'asfd'};
const obj99 = {name: 'asdf', value: 'qwer'}; // obj9이 더 넓음

// 좁은 타입은 넓은 타입에 대입 가능하지만 반대는 안됨



/** ****************************************************************************************
 * @설명 : 10. void의 두 가지 사용법
 ********************************************************************************************
 * 기본 문법 배우기_2: https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%98%AC%EC%9D%B8%EC%9B%90-1/unit/122307?tab=curriculum
********************************************************************************************/

interface A10 { a: string };
// const obj10: A10 = { a: 'asdf', b: 'qewr'}; // 객체 리터럴의 잉여속성검사 => 에러 뱉어냄
const obj10 = {a:'asf', b: 'qwer'};
const obj1010: A10 = obj10; // 검사를 안함

function func10(callback: () => void): void {
    // return 'a'; // 에러
}
func10(() => {
    return '3'
})

interface Human10 {
    talk: () => void;
};

const human: Human10 = {
    talk() { return undefined } // return 'asfd' 도 가능
}
// 즉, 매개변수와 메소드에서는 타입이 상관없고 함수의 직접적인 리턴값이 void인 경우에만 return 쓰면 에러남

// declare 쓰면 타입만 잠깐 선언해줄 수 있음, 다만 js로 변환하면 없어짐
declare function forEach(arr: number[], callback: (el: number) => void): void;
let target: number[] = [];
forEach([1,2,3], el => target.push(el)); // 매개변수에서 쓰이는 void는 실제 리턴값이 뭐라도 상관하지 않겠다
forEach([1,2,3], el => {target.push(el)});

interface I10 {
    talk: () => void;
}
const AI10: I10 = {
    talk() {return 3} // void는 리턴값을 무시하니 talk: () => void; 이면 b10의 리턴타입은 void
}
const b10 = AI10.talk(); // b10이 3인데도 void 타입이니 바꿔줌
const b1010 = AI10.talk() as unknown as number; // return이 number인게 확실할 때

// declare은 예를 들어 forEach가 다른 파일에서 선언되어 있으며 이걸 여기에서 쓴다고 할 때 작성
// browser에서 <script></srcript> 가 여러개 있는걸로 생각해보면 됨
// 외부에서 만들어진 애들을 타입 선언할 때 작성



/** ****************************************************************************************
 * @설명 : 11. unknown과 any(그리고 타입 대입가능표)
 ********************************************************************************************
 * 기본 문법 배우기_2: 
********************************************************************************************/

// any 쓸 바에 unknown 쓰셈 (typescript 안 쓴다는 포기 선언)... unknown을 쓰면 지금 당장은 모를 때 씀
// 나중에 쓸 땐 (b as A).talk(); 처럼 타입 지정해서 써야함

// 표: https://user-images.githubusercontent.com/10962668/179646513-3c3be896-3bbc-4784-848b-06bc47e8b129.png


/** ****************************************************************************************
 * @설명 : 12. 타입 좁히기(타입 가드)
 ********************************************************************************************
 * 기본 문법 배우기_2: 
********************************************************************************************/

function numOrStr12(a: number | string | number[]){
    if (typeof a === 'string'){
        a.split(',');
    }
    else if (typeof a === 'number'){
        a.toFixed(1);
    } else if (Array.isArray(a)) {
        a.concat(4);
    }
}

// unknown일 때 빼고는 as 쓰지말기

class A12 {
    aaa() {}
}
class B12 {
    bbb() {}
}

function aOrB12(param: A12 | B12){
    if(param instanceof A12){
        param.aaa();
    }
}
aOrB12(new A12()); // aOrB12(A12) => error

type B1212 = { type: 'b', bbb: string };
type C1212 = { type: 'c', ccc: string };
type D1212 = { type: 'd', ddd: string };

function typeCheck(a: B1212 | C1212 | D1212){
    // 값으로 구분
    if(a.type === 'b'){  // if('bbb' in a) 도 가능 (속성명으로 구분)
        a.bbb;
    } else if (a.type === 'c'){
        a.ccc;
    } else {
        a.ddd;
    }
}

// 객체에 태그를 달아줘서 타입가드하는 습관 들이기 (위 type B1212처럼)
// const human12 = { talk() {} };
// if('talk' in '객체')


/** ****************************************************************************************
 * @설명 : 13. 커스텀 타입 가드(is, 형색 조건자)
 ********************************************************************************************
 * 기본 문법 배우기_2: 
********************************************************************************************/

interface Cat13 { meow: number };
interface Dog13 { bow: number };
function catOrDog(a: Cat13 | Dog13): a is Dog13 {  // return에 is가 들어가 있는 것들은 커스텀 타입가드함수다.
    // 타입 판별 직접 만들기
    if((a as Cat13).meow) { return false };
    return true;
}
// 커스텀타입가드함수는 if문 안에서 쓰임. if문 안에 써서 정확한 타입이 뭔지 알려주는... 대신 타입 판별하는 것은 직접 코딩해야 함
// a is Dog13이 없으면 function catOrDog(a: Cat13 | Dog13): boolean 이 되고 써주면 function catOrDog(a: Cat13 | Dog13): a is Dog13

// 타입을 구분해주는 커스텀 함수를 직접 작성 가능
const cat13: Cat13 | Dog13 = { meow: 3 }
if(catOrDog(cat13)){
    console.log(cat13.bow)
}
if('meow' in cat13){
    console.log(cat13.meow)
}
