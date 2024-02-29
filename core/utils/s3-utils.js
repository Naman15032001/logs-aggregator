// Import the required AWS SDK modules
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromUtf8 } = require("@aws-sdk/util-utf8-node");
const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });

class S3Utils {

    constructor(){
        this.client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_KEY,
            },
        });
    }

    async push_to_s3(folderName, fileName, jsonString){
        try {
            const payload = {
                Bucket: "mw-code-tester",
                Key: `${folderName}/${fileName}.json`,
                Body: fromUtf8(jsonString), // Convert the JSON string to a Buffer using fromUtf8
                ContentType: 'application/json',
            };
    
            const command = new PutObjectCommand(payload)
    
            // Use the PutObjectCommand to upload the file and convert the response to a Promise
            const data = await this.client.send(command);
        } catch (error) {
            throw new error;
        }
    }

}

module.exports = S3Utils