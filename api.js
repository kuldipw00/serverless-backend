import client from "./db"

import { 
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    UpdateItemCommand,
    ScanCommand
} from "@aws-sdk/client-dynamodb"

import { marshall,unmarshall } from "@aws-sdk/util-dynamodb"

const getTaskByTaskId = async (event) =>{
    const response = { statusCode:200}

    try {

        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ taskId:event.pathParameters.taskId}),
        }

        const {Item } = await client.send(new GetItemCommand(params))

        console.log({Item})
        response.body = JSON.stringify({
            message:"Data retrieved",
            data:(Item)?unmarshall(Item):{},
            rawData: Item
        })

    }catch(e){
        console.error(e);
        response.statusCode = 500
        response.body = JSON.stringify({
            message:"Failed to retrieve data",
            errorMessage:e.message,
            errorStack:e.stack
        })
    }
}

const createTask = async (event) =>{
    const response = { statusCode:200}

    try {
        const body = JSON.parse(event.body)
        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(body || {}),
        }

        const CreateResult = await client.send(new PutItemCommand(params))

        console.log(CreateResult)
        response.body = JSON.stringify({
            message:"Task created succesfully",
            CreateResult
        })

    }catch(e){
        console.error(e);
        response.statusCode = 500
        response.body = JSON.stringify({
            message:"Failed to create data",
            errorMessage:e.message,
            errorStack:e.stack
        })
    }
}

const updateTask = async (event) =>{
    const response = { statusCode:200}

    try {
        const body = JSON.parse(event.body)
        const objKeys = Object.keys(body)
        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({taskId:event.pathParameters.taskId}),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
        }

        const UpdateResult = await client.send(new UpdateItemCommand(params))

        console.log(UpdateResult)
        response.body = JSON.stringify({
            message:"Task Updated succesfully",
            UpdateResult
        })

    }catch(e){
        console.error(e);
        response.statusCode = 500
        response.body = JSON.stringify({
            message:"Failed to update data",
            errorMessage:e.message,
            errorStack:e.stack
        })
    }
}

const deleteTask = async (event) =>{
    const response = { statusCode:200}

    try {
        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({taskId:event.pathParameters.taskId}),
            
        }

        const DeleteResult = await client.send(new DeleteItemCommand(params))

        console.log(DeleteResult)
        response.body = JSON.stringify({
            message:"Task Deleted succesfully",
            DeleteResult
        })

    }catch(e){
        console.error(e);
        response.statusCode = 500
        response.body = JSON.stringify({
            message:"Failed to delete data",
            errorMessage:e.message,
            errorStack:e.stack
        })
    }
}

module.exports = {
    getTaskByTaskId,
    createTask,
    updateTask,
    deleteTask

}