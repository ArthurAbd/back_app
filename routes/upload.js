const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer  = require("multer");
const fs = require('fs')
const Jimp = require('jimp');

// const waterMark = './uploads/1/rental.png'
// const resizeTo1280 = (filePath) => {
//     console.log(filePath)
    // return new Promise((resolve, reject) => {
    //     Jimp.read(filePath)
    //     .then(image => {
    //         Jimp.read(waterMark).then(water => {
    //             image
    //             .scaleToFit(1280, 960)
    //             .quality(80)
    //             .composite(water, 20, 0, {
    //                 mode: Jimp.BLEND_SOURCE_OVER,
    //                 opacitySource: 0.7,
    //                 opacityDest: 1
    //             })
    //             .write('./uploads/1/61.jpeg')
    //         })
    //     })
    //     .catch(err => {
    //         console.error(err)
    //     })
    // })
// }

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
        cb(null, `${req.user.userId}_${Date.now()}.jpeg`);
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
    fileSize:  1024 * 1024 * 20,
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
                        // resizeTo1280(req.file.path)
                        // .then((file) => {
                            return res.status(200).send(req.file.path)
                        // })
                        // .catch((err) => {
                        //     return res.status(500).send('Ошибка на сервере')
                        // })
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