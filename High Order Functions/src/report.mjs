// report.js
import { RootElement, RectangleElement, TextElement } from './drawing.mjs';
import { getAveragePrice, getUniqueHosts, mostReviewsNew, getHousingBorough } from './nyc-airbnb.mjs';
import os from "os";
import { readFile } from 'fs';
import {rowsToObjects} from './hoffy.mjs';

console.log('this is modified on Thursday 12/9.')
// function errorFn (error) {
//     console.log("error!", error)
// }


function generateReport(fileName){
    readFile(fileName, 'utf-8', function (error, data) {
        if (error) {
            console.log("Error!", error);
        } else {
            let resultStr = "";
            let rowArray = new Array();
            let boolean = false;
            let allLetterArray = data.split("");
            for (let i = 0; i < allLetterArray.length; i++){
                if (allLetterArray[i] === "\"") {
                    boolean = (!boolean);
                }
                if (allLetterArray[i] === "\n" && !boolean) {
                    rowArray.push(resultStr);
                    resultStr = "";
                } else {resultStr += allLetterArray[i];}
            }
            let headerList = rowArray.shift().split(",");
            let rowList = new Array();
            rowArray.filter(eachRow => {
                let result = new Array();
                let resultStr = "";
                let boolean = false;
                let rowSplitList = eachRow.split('');
                for (let j = 0; j < rowSplitList.length; j++){
                    let ele = rowSplitList[j]
                    if (ele === "\"") {
                        boolean = (!boolean);
                    }
                    if (ele === "," && !boolean) {
                        result.push(resultStr);
                        resultStr = "";
                    } else if (j === rowSplitList.length - 1) {
                        resultStr += ele;
                        result.push(resultStr);
                    } else {
                        resultStr += ele;
                    }
                }
                rowList.push(result);
            });

    
            

    let file = rowsToObjects({ headers: headerList, rows: rowList });
    // console.log(file);
    
    let line = '';
    let uniqueHostStr = '';
    let averagePriceList = getAveragePrice(file);
    let [mostReview, ReviewNumber, ReviewName]= mostReviewsNew(file);
    let housingBoroughs = getHousingBorough(file);
    let hostName = getUniqueHosts(file)
    // console.log(hostName);
    hostName.filter((x,n) => uniqueHostStr += os.EOL + "'" + hostName[n] + "'");
    

    line += "Average price for entire home/apt: " + averagePriceList[0];
    line += " and for private room: " + averagePriceList[1] + "." + os.EOL;
    line += "The house with the most reviews is named " + '"' + mostReview + '"' + " hosted by " + ReviewName + ". It has " + ReviewNumber + " reviews." + os.EOL;
    line += "The first five unique hosts after sorting is: " + uniqueHostStr + os.EOL;

    console.log(line);

    let heightList = Object.values(housingBoroughs); // []
    let boroughKey = Object.keys(housingBoroughs); // ["Manhattan", "Brooklyn", "Queens", "Staten Island", "Bronx"]


    let width = 100;
    let colors = ["red", "yellow", "blue", "green", "pink"];
    let fontsize = 12;
    let approximate_x = 20;
    let approximate_y = 20;
    

    let mymom = new RootElement();
    let Manhattanbar = new RectangleElement(width + approximate_x, heightList[0]/100 + approximate_y, width, heightList[0]/100, colors[0]);
    let Brooklynbar = new RectangleElement(2 * width + approximate_x, heightList[1]/100 + approximate_y, width, heightList[1]/100, colors[1]);
    let Queensbar = new RectangleElement(3 * width + approximate_x, heightList[2]/100 + approximate_y, width, heightList[2]/100, colors[2]);
    let Statenbar = new RectangleElement(4 * width + approximate_x, heightList[3]/100 + approximate_y, width, heightList[3]/100, colors[3]);
    let Bronxbar = new RectangleElement(5 * width + approximate_x, heightList[4]/100 + approximate_y, width, heightList[4]/100, colors[4]);
    mymom.addChild(Manhattanbar);
    mymom.addChild(Brooklynbar);
    mymom.addChild(Queensbar);
    mymom.addChild(Statenbar);
    mymom.addChild(Bronxbar);
    let text1 = new TextElement(width + approximate_x, fontsize + approximate_y, fontsize, "black", boroughKey);
    let text2 = new TextElement(width + approximate_x, 2 * fontsize + approximate_y, fontsize, "black", heightList.toString());
    mymom.addChild(text1);
    mymom.addChild(text2);

    mymom.write("nyc-airbnb-boroughs.svg", () => console.log('done writing!'));
        }})
}

generateReport(process.argv[2]);