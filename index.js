var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const PORT = process.env.PORT || "8002";
require('dotenv').config()


var aggregatorRouter = require("./routes/aggregator")

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));;

app.use("/", aggregatorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({
        error: "Unable to find the requested resource!",
    });
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(parseInt(PORT, 10), () => {
    console.log(`Listening on ${PORT}`);
});


module.exports = app;


AWS_S3_BUCKET = mw-code-tester
AWS_REGION =  ap-south-1
ACCESS_KEY =  AKIAVQHKED5NDIVEAKU6
SECRET_KEY = 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
LOG_LEVEL = info
