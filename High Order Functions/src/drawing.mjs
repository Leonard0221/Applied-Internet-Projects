import { writeFile } from "fs";
import os from "os";
console.log('this is modified on Thursday 12/9.')
// drawing.js
export class GenericElement {

    constructor (name) {
        this.name = name;
        this.childs = new Array;
        // this.svg = "http://www.w3.org/2000/svg"
    }
    setAttr (name, value) {
        if (name in this){this[name] = value;}
        else{console.log("Name doesn't exist!!!")} // What is the difference? setAttr vs addAttr...
    }
    addAttr (name, value) {
        this[name] = value;
    }
  
    addAttrs (obj) {
        let keysArray = Object.keys(obj);
        let valuesArray = Object.values(obj);
        console.log(keysArray);
        console.log(valuesArray);
        keysArray.filter((key, n) => {this.addAttr(key, valuesArray[n]);
        });
    }

    removeAttrs (arr) {
        arr.filter((ele) => {if (ele in this) {delete this[ele]}})
    }

    addChild (child) {
        this.childs.push(child);
    }

    write (fileName, cb) {
        // Don't forget to implement this
        writeFile(fileName, this.toString(), 'utf-8', (error) => {
            if(!error) {
                cb();
            }
            else{
                console.log("Error! Could not write to file", error);
            }
        });
    } 

    toString () {
        // RootElement {
                // name: undefined,
                // childs: [
                //     GenericElement {
                //     name: 'circle',
                //     childs: [],
                //     svg: 'http://www.w3.org/2000/svg',
                //     r: 75,
                //     fill: 'yellow',
                //     cx: 200,
                //     cy: 80
                //     },
                //     RectangleElement {
                //     name: undefined,
                //     childs: [],
                //     svg: 'http://www.w3.org/2000/svg',
                //     x: 0,
                //     y: 0,
                //     fill: 'blue',
                //     width: 200,
                //     height: 100
                //     },
                //     TextElement {
                //     name: undefined,
                //     childs: [],
                //     svg: 'http://www.w3.org/2000/svg',
                //     x: 50,
                //     y: 70,
                //     fill: 'red',
                //     fontsize: 70,
                //     content: 'wat is a prototype? 😬'
                //     }
                // ],
                // svg: 'http://www.w3.org/2000/svg',
                // width: 800,
                // height: 170
                // }
        let mod = '';
        let keysArray = Object.keys(this);
        console.log(keysArray);
        let valuesArray = Object.values(this);
        console.log(valuesArray);
        let childInd = keysArray.indexOf('childs');
        let getChildKOut = keysArray.splice(childInd, 1);
        console.log(keysArray);
        let getChildVOut = valuesArray.splice(childInd, 1);
        console.log(valuesArray);
        let firstKey = keysArray.shift();
        let firstValue = valuesArray.shift();
        console.log(keysArray);
        mod += '<'
        mod += firstValue; // <circle
        keysArray.filter((x,n) => {mod += (" " + keysArray[n] + "=" + '"' + valuesArray[n] + '"')}); // <circle key="value"
        mod += ('>' + os.EOL); //<circle key1="value1" key2="value2" key3="value3"> \n </circle>\n
        this.childs.filter(x => mod = mod + x + '');
        mod += '</';
        mod += (this.name + '>' + os.EOL);
        return mod;
    }
}

export class RootElement extends GenericElement {
    constructor(){
        super();
        // this.name = name;
        this.childs = new Array;
        
    }
    addAttrs(obj){
        super.addAttrs(obj);
    }

    setAttr (name, value) {
        super.setAttr(name, value);
    }

    addAttr (name, value) {
        super.addAttr(name, value);
    }

    addChild (child) {
        super.addChild(child);
    }

    removeAttrs(arr) {
        super.removeAttrs(arr);
    }

    write(fileName, cb){
        super.write(fileName, cb);
    }

    toString () {
        let mod = '';
        let keysArray = Object.keys(this);
        let valuesArray = Object.values(this);
        console.log(keysArray);
        console.log(valuesArray);
        let childInd = keysArray.indexOf('childs');
        let getChildKOut = keysArray.splice(childInd, 1);
        console.log(keysArray);
        let getChildVOut = valuesArray.splice(childInd, 1);
        console.log(valuesArray);
        let firstKey = keysArray.shift();
        let firstValue = valuesArray.shift();
        console.log(keysArray);
        console.log(valuesArray);
        
        mod += "<";
        mod += 'svg xmlns="http://www.w3.org/2000/svg"'; // <svg xmlns="http://www.w3.org/2000/svg"
        keysArray.filter((x, n) => {mod += (" " + keysArray[n] + "=" + '"' + valuesArray[n] + '"')}); // <svg key="value"
        mod += ('>' + os.EOL); //<rect key1="value1" key2="value2" key3="value3"> \n </svg>\n
        this.childs.filter(x => mod += (x + ''));
        mod += ("</svg>" + os.EOL);
        return mod;
    }
}

export class RectangleElement extends GenericElement{
    constructor (x, y, width, height, fill){
        super();
        this.x = x;
        this.y = y;
        // this.fill = fill;
        this.width = width;
        this.height = height;
        this.fill = fill;
    }

    addAttr(name, value) {
        super.addAttr(name, value);
    }

    setAttr(name, value) {
        super.setAttr(name, value);
    }

    addAttrs(obj) {
        super.addAttrs(obj);
    }

    removeAttrs(arr) {
        super.removeAttrs(arr);
    }

    addChild(child) {
        super.addChild(child);
    }

    write(fileName, cb){
        super.write(fileName, cb);
    }

    toString () {
        let mod = '';
        let keysArray = Object.keys(this);
        console.log(keysArray);
        let valuesArray = Object.values(this);
        console.log(valuesArray);
        let childInd = keysArray.indexOf('childs');
        let getChildKOut = keysArray.splice(childInd, 1);
        console.log(keysArray);
        let getChildVOut = valuesArray.splice(childInd, 1);
        console.log(valuesArray);
        let firstKey = keysArray.shift();
        let firstValue = valuesArray.shift();
        console.log(keysArray); 
        console.log(valuesArray);
        mod += "<";
        mod += "rect"; // <rect
        keysArray.filter((x, n) => {mod += (" " + keysArray[n] + "=" + '"' + valuesArray[n] + '"')}); // <rect key="value"
        mod += ('>' + os.EOL); //<rect key1="value1" key2="value2" key3="value3"> \n </rect>\n
        this.childs.filter(x => mod += (x + ''));
        mod += ("</rect>" + os.EOL);
        return mod;
    }
}


export class TextElement extends GenericElement{
    constructor (x, y, fontsize, fill, content){
        super();
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.fontsize = fontsize;
        this.content = content;

    }

    addAttr(name, value) {
        super.addAttr(name, value);
    }

    setAttr(name, value) {
        super.setAttr(name, value);
    }

    addAttrs(obj) {
        super.addAttrs(obj);
    }

    removeAttrs(arr) {
        super.removeAttrs(arr);
    }

    addChild(child) {
        super.addChild(child);
    }

    write(fileName, cb){
        super.write(fileName, cb);
    }

    toString () {
        let mod = '';
        let keysArray = Object.keys(this);
        console.log(keysArray);
        let valuesArray = Object.values(this);
        console.log(valuesArray);
        let contentInd = keysArray.indexOf('content');
        let contentKey = keysArray.splice(contentInd, 1);
        console.log(keysArray);
        let contentValue = valuesArray.splice(contentInd, 1);
        console.log(valuesArray);
        let childInd = keysArray.indexOf('childs');
        let getChildKOut = keysArray.splice(childInd, 1);
        console.log(keysArray);
        let getChildVOut = valuesArray.splice(childInd, 1);
        console.log(valuesArray);
        console.log(keysArray);
        let firstKey = keysArray.shift();
        console.log(keysArray);
        let firstValue = valuesArray.shift();
        console.log(valuesArray);
        
        mod += "<";
        mod += "text"; // <text
        keysArray.filter((x, n) => {mod += (" " + keysArray[n] + "=" + '"' + valuesArray[n] + '"')}); // <text key="value"
        mod += '>' 
        mod += (contentValue + os.EOL); //<text key1="value1" key2="value2" key3="value3">wat is a prototype? 😬\n </text>\n
        mod += ("</text>" + os.EOL);
        return mod;
    }
    
}

// the following is used for testing
// create root element with fixed width and height
const root = new RootElement();
root.addAttrs({width: 800, height: 170, abc: 200, def: 400});
root.removeAttrs(['abc','def', 'non-existent-attribute']);

// create circle, manually adding attributes, then add to root element
const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'yellow');
c.addAttrs({'cx': 200, 'cy': 80});
root.addChild(c);

// create rectangle, add to root svg element
const r = new RectangleElement(0, 0, 200, 100, 'blue');
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(50, 70, 70, 'red', 'wat is a prototype? 😬');
root.addChild(t);
// console.log(root);


// show string version, starting at root element
// console.log(root.toString());

// write string version to file, starting at root element
root.write('test.svg', () => console.log('done writing!'));