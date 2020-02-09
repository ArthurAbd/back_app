const express = require('express');
const router = express.Router();
const passport = require('passport');
const v = require('../helpers/validator');
const multer  = require("multer");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        const path = `./uploads/${new Date().getMonth()}`
        
        try {
            fs.statSync(path)
        } catch (error) {
            fs.mkdirSync(path)
        }

        cb(null, path);
    },

    filename: (req, file, cb) =>{
        cb(null, `${req.user.userId}_${Date.now()}.${file.mimetype.substr(6)}`);
    }
});

const isImg = (mimetype) => {
    return (mimetype === "image/png" || 
    mimetype === "image/jpg" || 
    mimetype === "image/jpeg")
}

const fileFilter = (req, file, cb) => {
    if (isImg(file.mimetype)) {
        return cb(null, true);
    }
    cb(null, false)
}


const limits =  {
    fileSize:  1024 * 1024 * 10,
    files: 20,
    fields: 0
}

const uploadSingle = multer({storage, fileFilter, limits}).single('img')
const uploadArray = multer({storage, fileFilter, limits}).array('img', 20)

router.post('/single', 
    passport.authenticate('bearer', { session: false }),
        function (req, res, next) {
            try {
                uploadSingle(req, res, function (err) {
                    if (err) {
                        console.log(err)
                        return res.status(403).send(err.message);
                    }

                    if (req.file) {
                        return res.status(200).send(req.file.path);
                    }
                    res.status(403).send('Добавьте фотографии')
                })
            } catch (error) {
                res.status(500).send('Ошибка на сервере');
            }
            
        });

router.post('/array', 
    passport.authenticate('bearer', { session: false }),
        function (req, res, next) {
            try {
                uploadArray(req, res, function (err) {
                    if (err) {
                        console.log(err)
                        return res.status(403).send(err.message);
                    }
                    if (req.files[0]) {
                        return res.status(200).send(req.files.map(img => img.path))
                    }
                    res.status(403).send('Добавьте фотографии')
                })
            } catch (error) {
                res.status(500).send('Ошибка на сервере');
            }

        })


module.exports = router;