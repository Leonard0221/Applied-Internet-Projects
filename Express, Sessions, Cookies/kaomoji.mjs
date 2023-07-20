// kaomoji.mjs
// import fs from 'fs';

export class Kaomoji{

    constructor (value, emotions) {
        this.value = value;
        this.emotions = emotions;
    }

    isEmotion (emotion) {
        let res = false;
        this.emotions.forEach(element => {
            if (element === emotion){
                res = true;
            }
        });
        return res;
    }
}

// fs.readFile('./code-samples/kaomojiData.json', 'utf-8', (error, data) => {
//     if (error) {
//         console.log("This is error.", error);
//         return;
//     }
//     const array = JSON.parse(data);
//     // console.log(data);
//     const newArray = new Array;
//     array.forEach((element) => {
//         const each = new Kaomoji(element['value'], element['emotions']);
//         newArray.push(each);
//     });
// });
  
  
  
  
  
