var express = require("express");
var router = express.Router();
const AggregatorController =require('./../core/controllers/aggregator.controller')

const API_GROUP = "/api/v1";

router.post(API_GROUP + "/ingest", (...args) =>
    new AggregatorController().injest_logs(...args)
);

router.get(API_GROUP + "/query", (...args) =>
    new AggregatorController().search_logs(...args)
);


module.exports = router;
