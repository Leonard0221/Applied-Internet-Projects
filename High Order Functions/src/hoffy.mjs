// hoffy.js
import {readFile} from 'fs';


export function getEvenParam(...string){
    let sieve = string.filter(function(word){return string.indexOf(word) % 2 === 0})
    return sieve;
}


export function maybe(fn) {
    return function(...args) {
        if (args.indexOf(null) > -1) {
            return undefined;
        } else if (args.indexOf(undefined) > -1){ 
            return undefined;
        } else {
            return fn(...args);
        }
    }
}


export function filterWith(fn){
    return function(newArray){
        let Array = newArray.filter(fn)
        return Array;
    }
}


export function repeatCall(fn, n, ...string){
    let newArray = new Array(n).fill(string[0]);
    newArray.filter(function(n){return fn(n)});
}


export function largerFn(fn, gn){
    return function(...string){
        if (fn(string[0]) >= gn(string[1])){
            return fn;
        } else {
            return gn;
        }
    }
}


export function limitCallsDecorator(fn, n){
    let count = 0;
    return function(...string){
        count += 1;
        if (count <= n) {
            return fn(...string);
        } else {
            return undefined;
        }
    }
}

export function myReadFile(fileName, successFn, errorFn){
    readFile(fileName, "utf8", (error, data) => {
        if (error){errorFn(error)}
        successFn(data)})

}

export function rowsToObjects(data){
    return data.rows.map(ele => {
        return Object.fromEntries(ele.map((inner,ind) => [data.headers[ind], inner]));
    })
}




