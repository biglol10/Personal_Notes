function calculateArea(shape) {
    if (shape.kind === "rectangle") {
        shape;
        return shape.width * shape.height;
    }
    else {
        shape;
        return shape.width * shape.width;
    }
}
class Square1 {
    constructor(width) {
        this.width = width;
    }
}
class Rectangle1 extends Square1 {
    constructor(width, height) {
        super(width);
        this.width = width;
        this.height = height;
    }
}
function calculateArea1(shape) {
    if (shape instanceof Rectangle1) {
        shape;
        return shape.width * shape.height;
    }
    else {
        shape;
        return shape.width * shape.width;
    }
}
function asNumber(val) {
    return typeof val === "string" ? Number(val) : val;
}
function add(a, b) {
    return a + b;
}
const three = add(1, 2);
const twelve = add("1", "2");
function calculateLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}
const v = { x: 3, y: 4, name: "Biglol" };
calculateLength(v);
function normalize(v) {
    const length = calculateLength(v);
    return {
        x: v.x / length,
        y: v.y / length,
        z: v.z / length,
    };
}
const ps = {
    name: "smth",
    birth: new Date("1912/06/23"),
};
