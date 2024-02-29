const Controller = require("../controllers/controller");
const { logger } = require("../lib/log");
const S3Utils = require("../utils/s3-utils");
const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

class AggregatorService {
  async injest_logs(input) {
    logger.info("AggregatorService -> injest_logs -> started");
    
    let logs_array = input;
    // validate input
    if (!this.validate_injest_input(logs_array)) {
      let e = Controller.get_error("badRequest");
      throw e;
    }

    //sort logs
    logs_array.sort(this.compare_by_timestamp);
    logger.info("AggregatorService -> injest_logs -> sorted logs -> " , logs_array);
    const s3utils = new S3Utils();
    try {
      await s3utils.push_to_s3(
        "NAMAN",
        `${Date.now()}`,
        JSON.stringify(logs_array)
      );
    } catch (error) {
      console.log("error", error);
      let e = Controller.get_error("internalError", `Injest logs error`);
      throw e;
    }
    return {
      message : "injested successfully"
    }
  }

  validate_injest_input(data) {
    if (!Array.isArray(data)) {
      return false;
    }

    for (const obj of data) {
      // Check if each object has 'time' and 'log' keys
      if (!obj.hasOwnProperty("time") || !obj.hasOwnProperty("log")) {
        return false;
      }
      // Check if 'time' is a number and 'log' is a string
      if (typeof obj.time !== "number" || typeof obj.log !== "string") {
        return false;
      }
    }
    return true;
  }

  compare_by_timestamp(a, b) {
    return a.time - b.time;
  }

  async parse_object_data(object_data) {
    return new Promise((resolve, reject) => {
      const chunks = [];

      object_data.Body.on("data", (chunk) => {
        chunks.push(chunk);
      });

      object_data.Body.on("end", () => {
        const data = Buffer.concat(chunks);
        const logs = JSON.parse(data.toString("utf-8"));
        resolve(logs);
      });

      object_data.Body.on("error", (error) => {
        reject(error);
      });
    });
  }

  async search_logs(req) {
    logger.info("AggregatorService -> search_logs -> started");
    const start_time = parseInt(req.query.start);
    const end_time = parseInt(req.query.end);
    const search_text = req.query.text;

    if (!start_time || !end_time || !search_text) {
      let e = Controller.get_error("badRequest");
      throw e;
    }

    const prefix = "NAMAN/";

    try {
      const s3utils = new S3Utils();

      const filtered_logs = [];
      let continuationToken = null;

      // PAGINATION BASED APPROACH
      while (true) {
        const params = {
          Bucket: "mw-code-tester",
          Prefix: prefix,
          ContinuationToken: continuationToken,
        };

        const data = await s3utils.client.send(
          new ListObjectsV2Command(params)
        );

        for (const obj of data.Contents) {
          const timestamp = parseInt(obj.Key.split("/")[1].split(".")[0]);
          if (timestamp >= start_time && timestamp <= end_time) {
            const logs = await this.get_object_logs(obj.Key, s3utils);
            logs.forEach((log) => {
              if (log.log.includes(search_text)) {
                filtered_logs.push(log);
              }
            });
          }
        }

        if (!data.NextContinuationToken) {
          break;
        }

        continuationToken = data.NextContinuationToken;
      }

      return { data: filtered_logs };
    } catch (err) {
      logger.error(err);
      let e = Controller.get_error("internalError", `Internal Server error`);
      throw e;
    }
  }

  async get_object_logs(key, s3utils) {
    try {
      const getObjectParams = {
        Bucket: "mw-code-tester",
        Key: key,
      };
      const object_data = await s3utils.client.send(
        new GetObjectCommand(getObjectParams)
      );
      return await this.parse_object_data(object_data);
    } catch (error) {
      logger.error("Error getting object logs:", error);
      return [];
    }
  }

  // read file data as a stream
  async parse_object_data(object_data) {
    return new Promise((resolve, reject) => {
      const chunks = [];

      object_data.Body.on("data", (chunk) => {
        chunks.push(chunk);
      });

      object_data.Body.on("end", () => {
        const data = Buffer.concat(chunks);
        const logs = JSON.parse(data.toString("utf-8"));
        resolve(logs);
      });

      object_data.Body.on("error", (error) => {
        reject(error);
      });
    });
  }
}

module.exports = AggregatorService;
