// MONGODB PW: pKgF9ci7ofKBIkaq
// MONGODB CONNECTION: mongodb+srv://kris-v:<password>@cluster0.8bnnq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Sauce = require('./models/sauce');

const app = express();

mongoose.connect('mongodb+srv://kris-v:pKgF9ci7ofKBIkaq@cluster0.8bnnq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());


// app.post('/api/auth/signup', (req, res, next) => {
//   console.log(req.body);
//   res.status(201).json({
//     message: 'User created successfully!'
//   });
// });


// const sauceSchema = mongoose.Schema({  
//   userId: { type: String, required: true },
//   name: { type: String, required: true },
//   manufacturer: { type: String, required: true },
//   description: { type: String, required: true },
//   mainPepper: { type: String, required: true },
//   imageUrl: { type: String, required: true },
//   heat: { type: Number, required: true },
//   likes: { type: Number, required: true },
//   dislikes: { type: Number, required: true },
//   usersLiked: { type: Array, required: true },
//   usersDisliked: { type: Array, required: true }
// });

app.post('/api/sauces', (req, res, next) => {
  const sauce = new Sauce({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    usersLiked: req.body.usersLiked,
    usersDisliked: req.body.usersDisliked
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      })
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


app.use('/api/sauces', (req, res, next) => {
  const stuff = [
    {
      _id: 'oeihfzeoi',
      userId: 'req.body.userId',
      name: 'req.body.name',
      manufacturer: 'req.body.manufacturer',
      description: 'req.body.description',
      mainPepper: 'req.body.mainPepper',
      imageUrl: 'req.body.imageUrl',
      heat: 'req.body.heat',
      likes: 'req.body.likes',
      dislikes: 'req.body.dislikes',
      usersLiked: 'req.body.usersLiked',
      usersDisliked: 'req.body.usersDisliked'
    },
    {
      _id: 'someRandomId',
      title: 'My second thing',
      description: 'All of the info about my second thing',
      imageUrl: '',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff);
});

module.exports = app;