const Sauce = require('../models/sauce');
const fs = require('fs');
const { findOne } = require('../models/sauce');
const sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
      likes: 0,
      dislikes: 0,
      usersLiked: req.body.sauce.usersLiked,
      usersDisliked: req.body.sauce.usersDisliked
    });
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Post saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
        res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
        res.status(404).json({
            error: error
        });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            // userId: req.body.sauce.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
            // likes: req.body.sauce.likes,
            // dislikes: req.body.sauce.dislikes,
            // usersLiked: req.body.sauce.usersLiked,
            // usersDisliked: req.body.sauce.usersDisliked
        };
    } else {
        sauce = {
            _id: req.params.id,
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            // likes: req.body.likes,
            // dislikes: req.body.dislikes,
            // usersLiked: req.body.usersLiked,
            // usersDisliked: req.body.usersDisliked
        };
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
        res.status(201).json({
            message: 'Sauce updated successfully!'
        });
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({_id: req.params.id}).then(
                    () => {
                    res.status(200).json({
                        message: 'Deleted!'
                        });
                    }
                ).catch(
                    (error) => {
                    res.status(400).json({
                        error: error
                    });
                    }
                );
            });
        }
    );
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
        res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
};

exports.getRating = (req, res, next) => {
    // find the sauce using Sauce.findOne()
    // use a conditional that lets me know which thumb has been clicked using req.body.like that will give a number (1, -1, 0)
    
        Sauce.findOne({_id: req.params.id}).then(
            (sauce) => {

                const sauceUpdate = {
                    likes: sauce.likes,
                    dislikes: sauce.dislikes,
                    usersLiked: sauce.usersLiked,
                    usersDisliked: sauce.usersDisliked
                }

                console.log(sauce)
                if (req.body.like === 1) {
                    
                    // If req.body === 1 -> update amount of likes
                    // add userId to usersLiked array
                    
                    if (!sauceUpdate.usersLiked.includes(req.body.userId)) {
                        sauceUpdate.usersLiked.push(req.body.userId)
                        sauceUpdate.likes += 1
                        console.log(sauceUpdate)
                    }
                             // object I am using to update the record
                } else if (req.body.like === -1) {
                    console.log(sauceUpdate)

                    if (!sauceUpdate.usersDisliked.includes(req.body.userId)) {
                        sauceUpdate.usersDisliked.push(req.body.userId)
                        sauceUpdate.dislikes += 1
                        console.log(sauceUpdate)
                    }

                }  else if (req.body.like === 0 && sauce.usersLiked.some(user => user === req.body.userId)) {
                    // delete userId from usersLiked array and subtract 1 form likes array

                    if (sauceUpdate.likes > 0) {
                        sauceUpdate.likes -= 1
                        const userIndex = sauceUpdate.usersLiked.findIndex(user => user === req.body.userId)
                        sauceUpdate.usersLiked.splice(userIndex, 1)
                        console.log({'0 from like': sauceUpdate})
                    }

                    
                } else if (req.body.like === 0 && sauce.usersDisliked.some((user) => req.body.userId === user)) {
                    // delete userId from usersDisliked array and subtract 1 from dislikes

                    if (sauceUpdate.dislikes > 0) {
                        sauceUpdate.dislikes -= 1
                        const userIndex = sauceUpdate.usersDisliked.findIndex(user => req.body.userId === user)
                        sauceUpdate.usersDisliked.splice(userIndex, 1)
                        console.log({'0 from dislike': sauceUpdate})
                    }
                }

            Sauce.updateOne({_id: req.params.id}, sauceUpdate)
            .then(() => {
                res.status(201).json({
                    message: 'Great Sauce!'
            });
            })
            .catch(
                (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
    }
)}
