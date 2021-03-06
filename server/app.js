const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const send = require('./send');
var app = express();
var keys = require('./keys');
var nodemailer = require('nodemailer');
var db = require('../db/mongoose');
var GalleryItem = require('../db/models/gallery-item');
const path = require('path');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg'
}
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "/server/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.post('/booking/submit',multer({storage: storage}).single('image'), (req, res) => {
  const form = req.body;  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.keys.emailInfo.username,
      pass: keys.keys.emailInfo.password,
    }
  });
  if (req.file) {
    var mailOptions = {
      attachments: [
        {
          filename: req.file.filename,
          path: __dirname + '/images/' + req.file.filename,
      }
      ],
      from: keys.keys.emailInfo.username,
      to: keys.keys.personalEmail.address,
      subject: `Customer inquiry from ${req.body.firstName} ${req.body.lastName}.`,
      text: `
      Client Name: ${req.body.firstName} ${req.body.lastName}
      Client Email: ${req.body.email}
      Client Mobile: ${req.body.mobile}
  
      ${req.body.message}
      `
    };
    send.sendInquiry(mailOptions, transporter);
  } else {
    var mailOptions = {
      from: keys.keys.emailInfo.username,
      to: keys.keys.personalEmail.Address,
      subject: `Customer inquiry from ${req.body.firstName} ${req.body.lastName}.`,
      text: `
      Client Name: ${req.body.firstName} ${req.body.lastName}
      Client Email: ${req.body.email}
      Client Mobile: ${req.body.mobile}
  
      ${req.body.message}
      `
    };
    send.sendInquiry(mailOptions, transporter);
  }
  res.status(201).json({
    message: 'submitted'
  })
});

app.get('/gallery', (req, res) => {
  GalleryItem.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({
        galleryItems: items
      })
    }
  });
  // const galleryItems = [{
  //     name: 'Low Top Fade',
  //     description: 'Low top, short sides',
  //     imagePath: "../../../assets/resources/cuts/0.jpeg"
  //   },
  //   {
  //     name: 'High Top Fade',
  //     description: 'High top, short sides',
  //     imagePath: "../../../assets/resources/cuts/1.jpeg"
  //   },
  //   {
  //     name: 'Combover',
  //     description: 'To the side',
  //     imagePath: "../../../assets/resources/cuts/2.jpeg"
  //   }
  // ]
  // res.status(201).json({
  //   galleryItems: galleryItems
  // })
})

app.get('/gallery/:id', (req, res) => {
  GalleryItem.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({
        galleryItems: items[req.params.id]
      })
    }
  });

  // const galleryItems = [{
  //     name: 'Low Top Fade',
  //     description: 'Low top, short sides',
  //     imagePath: "../../../assets/resources/cuts/0.jpeg"
  //   },
  //   {
  //     name: 'High Top Fade',
  //     description: 'High top, short sides',
  //     imagePath: "../../../assets/resources/cuts/1.jpeg"
  //   },
  //   {
  //     name: 'Combover',
  //     description: 'To the side',
  //     imagePath: "../../../assets/resources/cuts/2.jpeg"
  //   }
  // ]

  // res.status(201).json({
  //   galleryItems: galleryItems[req.params.id]
  // })
 })

//  app.use("/", express.static(path.join(__dirname, '/../dist/vgcutz')));


// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, '/../dist/vgcutz/index.html'));
// });


 app.listen(3000);



module.exports = app;