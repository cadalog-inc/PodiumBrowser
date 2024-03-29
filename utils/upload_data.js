const categories = require('../src/data/categories.json');
const items = require('../src/data/items.json');
const relationships = require('../src/data/relationships.json');

const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-west-2",
    endpoint: 'https://dynamodb.us-west-2.amazonaws.com/',
    // accessKeyId default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    accessKeyId: "AKIAZKYMH4JCPQTQPQ4J",
    // secretAccessKey default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    secretAccessKey: "+/M1uIc1EUN42miGL+6BCLbujs7wYudoZHimcV7P"
});
const docClient = new AWS.DynamoDB.DocumentClient();

class UploadData {
    main() {
        // if(categories.length > 0) {
        //     this.uploadCategory(0);
        // }
        // if(items.length > 0) {
        //     this.uploadItem(0);
        // }
        if(relationships.length > 0) {
            this.uploadRelationship(0);
        }
    }

    uploadCategory(index) {
        const params = {
            TableName: "Categories",
            Item: categories[index]
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`{ category: { index: ${index}, data: ${data} } }`);
                if(index+1 < categories.length) {
                    this.uploadCategory(index+1);
                }
            }
        });
    }

    uploadItem(index) {
        const params = {
            TableName: "Items",
            Item: items[index]
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`{ item: { index: ${index}, data: ${data} } }`);
                if(index+1 < items.length) {
                    this.uploadItem(index+1);
                }
            }
        });
    }

    uploadRelationship(index) {
        const params = {
            TableName: "Relationships",
            Item: relationships[index]
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`{ relationship: { index: ${index}, data: ${data} } }`);
                if(index+1 < relationships.length) {
                    this.uploadRelationship(index+1);
                }
            }
        });
    }
}

new UploadData().main();