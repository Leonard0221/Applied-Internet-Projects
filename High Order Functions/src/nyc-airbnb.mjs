// nyc-airbnb.mjs

import { readFile } from 'fs';
import {rowsToObjects} from './hoffy.mjs';



// let data = [
//     {id: '2539',
//     name: 'Clean & quiet apt home by the park',
//     host_id: '2787',
//     host_name: 'John',
//     neighbourhood_group: 'Brooklyn',
//     neighbourhood: 'Kensington',
//     latitude: '40.64749',
//     longitude: '-73.97237',
//     room_type: 'Entire home/apt',
//     price: '149',
//     minimum_nights: '1',
//     number_of_reviews: '9',
//     last_review: '2018-10-19',
//     reviews_per_month: '0.21',
//     calculated_host_listings_count: '6',
//     availability_365: '365'},

//     {id: '2539',
//     name: 'Clean & quiet apt home by the park',
//     host_id: '2787',
//     host_name: 'John',
//     neighbourhood_group: 'Brooklyn',
//     neighbourhood: 'Kensington',
//     latitude: '40.64749',
//     longitude: '-73.97237',
//     room_type: 'Entire home/apt',
//     price: '150',
//     minimum_nights: '1',
//     number_of_reviews: '9',
//     last_review: '2018-10-19',
//     reviews_per_month: '0.21',
//     calculated_host_listings_count: '6',
//     availability_365: '365'},

//     {id: '2539',
//     name: 'Clean & quiet apt home by the park',
//     host_id: '2787',
//     host_name: 'John',
//     neighbourhood_group: 'Brooklyn',
//     neighbourhood: 'Kensington',
//     latitude: '40.64749',
//     longitude: '-73.97237',
//     room_type: 'Private room',
//     price: '150',
//     minimum_nights: '1',
//     number_of_reviews: '9',
//     last_review: '2018-10-19',
//     reviews_per_month: '0.21',
//     calculated_host_listings_count: '6',
//     availability_365: '365'},

// ]


export function getAveragePrice(data){
    let priceSumHA = 0;
    let priceSumPR = 0;
    let AvgHouseApt = 0;
    let AvgPrivate = 0;
    let houseAptType = data.filter(x => x['room_type'] === "Entire home/apt");
    let PrivateRoomType = data.filter(x => x['room_type'] === "Private room");
    houseAptType.filter(function(x){
        priceSumHA += parseInt(x["price"]);
        AvgHouseApt = (priceSumHA/houseAptType.length).toFixed(2);
    })
    PrivateRoomType.filter(function(x){
        priceSumPR += parseInt(x["price"]);
        AvgPrivate = (priceSumPR/PrivateRoomType.length).toFixed(2);
    })
    return [AvgHouseApt, AvgPrivate]; // 2 strings in a list;
}


export function mostReviews(data){
    let MostReviewHouse = data.reduce((prev, current) => {
          return prev["number_of_reviews"] > current["number_of_reviews"] ? prev : current
        });
    return MostReviewHouse["name"];

}

export function mostReviewsNew(data){ // Not for submission, for convenience of report
    let MostReviewHouse = data.reduce((prev, current) => {
          return prev["number_of_reviews"] > current["number_of_reviews"] ? prev : current
        });
    // console.log(MostReviewHouse);
    return [MostReviewHouse["name"], MostReviewHouse["number_of_reviews"], MostReviewHouse["host_name"]];

}

export function getUniqueHosts(data){
    let uniqueName = new Array();
    data.filter(element => {
        if (uniqueName.includes(element["host_name"]) === false) {
            uniqueName.push(element["host_name"]);
        }
    });
    uniqueName.sort();
    uniqueName = uniqueName.filter((x,idx) => idx < 5);
    return uniqueName;
}

export function getHousingBorough(data){
    let setInitial = {"Manhattan": 0, "Brooklyn": 0, "Queens": 0, "Staten Island": 0, "Bronx": 0};
    // return setInitial;
    let ManhattanBorou = data.filter(x => x["neighbourhood_group"] === "Manhattan");
    let BkBorou = data.filter(x => x["neighbourhood_group"] === "Brooklyn");
    let QueensBorou = data.filter(x => x["neighbourhood_group"] === "Queens");
    let StatenBorou = data.filter(x => x["neighbourhood_group"] === "Staten Island");
    let BronxBorou = data.filter(x => x["neighbourhood_group"] === "Bronx");
    setInitial["Manhattan"] = ManhattanBorou.length;
    setInitial["Brooklyn"] = BkBorou.length;
    setInitial["Queens"] = QueensBorou.length;
    setInitial["Staten Island"] = StatenBorou.length;
    setInitial["Bronx"] = BronxBorou.length;

    return setInitial;

}

// console.log(getHousingBorough(data));