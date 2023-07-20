// app.mjs
import express from 'express';
import path from 'path';
import fs from 'fs';
import { Kaomoji } from './kaomoji.mjs';
import session from 'express-session';

const sessionOptions = {
	secret: 'secrets of targaryen',
	resave: true,
	saveUninitialized: true
};

// import hbs from 'hbs';
const newArray = new Array;
const publicPath = path.resolve(new URL(import.meta.url).pathname, '..', 'public');
const app = express();
app.set('view engine', 'hbs');
const viewsPath = path.resolve(new URL(import.meta.url).pathname, '..', 'views');
app.set('views', viewsPath);
app.use(express.static(publicPath));
app.use(express.urlencoded({extended : false}));
app.use(session(sessionOptions));

function wordToClass(ele) {
    for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].isEmotion(ele)) {return newArray[i].value;}
    }
    return false;
}
app.use((req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Query:', req.query);
    console.log("Session:", Object.assign({sessionID: req.sessionID !== null || req.sessionID !== undefined}, req.session));
    console.log("====================================");
    next();
});

app.get('/', (req, res) => {
    res.redirect('/editor');
});

app.get('/editor', (req, res) => {
    let transWord = new Array;
    const originalWords = (req.query.editor || "");
    const words = originalWords.split(/\s+/);
    const proWords = words.map(word => word.replaceAll(/[^\w\s]/gi, ''));
    for (let i = 0; i < proWords.length; i++) {
        const ele = proWords[i];
        if (wordToClass(ele)) {
            transWord.push(wordToClass(ele));
        } else {
            transWord.push(ele);
        }
    }
    transWord = transWord.join(" ");
    res.render('editor', { title: 'Editor', layout: 'layout', transWord });
});

app.use((req, res, next) => {
    const query = JSON.stringify(req.query);
    const parts = query.split("?");
    const pathURL = parts[0];
    let queryEmotion = {"emotion" : ''};
    if (query !== '{}'){
        queryEmotion["emotion"] = req.query["data"][0];
    } else {
        queryEmotion = query;
    }
    console.log(queryEmotion);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${pathURL}`);
    console.log(`Query: ${JSON.stringify(queryEmotion)}`);
    console.log("Session:", Object.assign({sessionID: req.sessionID !== null || req.sessionID !== undefined}, req.session));
    console.log("============================================");
    next();
});


app.get('/dictionary', (req, res) => {
    let data = newArray;
    let string = '';
    try{
        string = req.query["data"][0];
        // console.log(string);
        // console.log(string !== '');
        if(string !== ''){
            for (let i=0; i<data.length; i++) {
                // console.log(data[i].emotions);
                if (data[i].emotions.includes(string)){data = data[i];}
            }
            data = [data];
            res.render('dictionary', { dictionary : data });
        } else {
            data = newArray;
            res.render('dictionary', { dictionary : data });
        }
        
    } catch (error) {
        string = '';
        // console.log(data);
        res.render('dictionary', { dictionary : data });
    }
});

app.get("/stats", (req, res) => {
    if("countAdd" in req.session === false){
        req.session["countAdd"] = 0;
    }
    const countAdd = req.session["countAdd"];
    res.render("stats", {countAdd});
});


app.post('/dictionary', (req, res) => {
    if("countAdd" in req.session === false){
        req.session["countAdd"] = 0;
    }
    const emotionsList = req.body.emojiValue.split(",");
    const emotionValue = req.body.emojiInput;
    const newMoji = new Kaomoji(emotionValue, emotionsList);
    newArray.push(newMoji);
    req.session.countAdd += 1;
    res.redirect('/dictionary');
});


// app.use(function(req, res, next) {
// 	console.log(req.method, req.path);
// 	next();
// });



// make sure to listen to bind to a port
fs.readFile('./code-samples/kaomojiData.json', 'utf-8', (error, data) => {
    if (error) {
        console.log("This is error.", error);
        return;
    }
    const array = JSON.parse(data);
    // console.log(data);
    array.forEach((element) => {
        const each = new Kaomoji(element['value'], element['emotions']);
        newArray.push(each);
    });
    app.listen(3000);
    console.log('Server started; type CTRL+C to shut down');
});
