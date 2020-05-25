var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");

const database = require("./config/database.config.js");

//Connecting to database
mongoose.connect(process.env.MONGOLAB_URI || database.url, {useNewUrlParser: true, useUnifiedTopology: true});

const port = process.env.PORT || 5000;

//Initiating express
var news = express();
var router = express.Router();

var News = require("./news.js");

news.use(express.static(path.join(__dirname, 'content')));

news.use(bodyParser.json());
news.use(bodyParser.urlencoded({ extended: false }))

//Starts the server
var server = news.listen(port, function() {
    var appPort = server.address().port;
    console.log("Servern är startad på port " + appPort);
});

news.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
	next();
});

//Adds a news
router.post("/news/add", function(req, resp){
    var aNews = new News();

        aNews.newsTitle = req.body.newsTitle;
        aNews.newsContent = req.body.newsContent;
        var cet = new Date();
        cet.setHours( cet.getHours() + 2); //Central European Time
        aNews.newsDate = cet;
    
        aNews.save();
    
        resp.redirect("/admin.html");
    
});

//Redirects to admin-frontpage on login
router.post("/admin/login/", function(req, resp) {
    resp.redirect("/admin.html");
});

//Displays all news
router.get("/news", function(req, resp) {
    News.find(function(err, News) {
        if(err) {
            resp.send(err);
        }

        resp.json(News);
    })
});

//Displays news with chosen ID
router.get("/news/:id", function(req,resp) {
    var Id = req.params.id;

    News.find( {
        _id : Id
    }, function(err, result) {
        if(err) {
            resp.send(err);
        } else {
            resp.send(result);
        }
    });
});

//Updates news with chosen ID
router.post("/news/update/:id", function(req,resp) {
    var updateId = req.params.id;
	var update = {
		"$set": {
			newsTitle: req.body.newsTitle2,
			newsContent: req.body.newsContent2
		}
	};

	if(req.body.newsTitle2 != "" && req.body.newsContent2 != "") { //If edit-forms fields are not empty
		News.updateOne({
			_id: updateId
		}, update , function(err, result) {
			if(err) {
				resp.send(err);
			} else {
                resp.redirect("/admin.html");
			}
		});
	} else {
		resp.redirect("/admin.html");
	}
    
});

//Deletes chosen news
router.delete("/news/delete/:id", function(req,resp) {
    var deleteId = req.params.id;

    News.deleteOne({
        _id: deleteId
    }, function(err, result) {
        if(err) {
            resp.send(err);
        } else {
            resp.send(result);
        }
    });
    
});

news.use("/", router);

news.get("*", (req, resp) => resp.sendFile(__dirname + "/content/index.html"));