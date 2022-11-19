const { DynamoDBClient} = requuire("@aws-sdk/client-dynamodb")
const client = new DynamoDBClient({})

module.exports = client