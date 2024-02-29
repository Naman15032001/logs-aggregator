const Controller = require("./controller");
const AggregatorService = require("../services/aggregator-service");
const { logger } = require("../lib/log");

class AggregationController extends Controller {

    /**
    *  @api {post} /api/v1/injest_logs that uploads a logs json file to AWS S3
    *  @apiName Aggregator @apiVersion 1.0.0
    *  @apiSuccessExample Success-Response: HTTP/1.1 200 OK
    *  @apiError Bad request HTTP/1.1 400 (Validation failed)
    *  @apiError Internal error HTTP/1.1 500
    *
    * */
    async injest_logs(req, res, next) {
        logger.info('AggregationController -> injest_logs -> started')
        try {
            const input = req.body;
            const as = new AggregatorService();
            const result = await as.injest_logs(input);
            this.send_response(res, "success", result);
        } catch (error) {
            logger.info(error)
            this.handle_error_response(error, res, next);
        }
    }

    /**
     *  @api {get} /api/v1/query?start={start_time}&end={end_time}&text={text} retrieve logs that match the filter
     *  @apiName Aggregator @apiVersion 1.0.0
     *  @apiSuccess Aggregator json
     *  @apiSuccessExample Success-Response: HTTP/1.1 200 OK
     *  @apiError Bad request HTTP/1.1 404 (Not found)
     *  @apiError Internal error HTTP/1.1 500
     *
    * */
    async search_logs(req, res, next) {
        logger.info('AggregationController -> search_logs -> started')
        try {
            const as = new AggregatorService();
            const result = await as.search_logs(req);
            this.send_response(res, "success", result);
        } catch (error) {
            logger.info(error)
            this.handle_error_response(error, res, next);
        }
    }

}

module.exports = AggregationController;
