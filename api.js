const client = require("./db");

const {
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getTaskByTaskId = async (event) =>{
    const response = { statusCode:200}

    try {

        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ taskId:parseInt(event.pathParameters.taskId)}),
        }

        const {Item } = await client.send(new GetItemCommand(params))

        console.log("Item",{Item})
        response.body = JSON.stringify({
            message:"Data retrieved",
            data:(Item) ? unmarshall(Item):{},
            rawData: Item
        })

        console.log("response.body",response.body)

    }catch(e){
        console.error(e);
        response.statusCode = 500
        response.body = JSON.stringify({
            message:"Failed to retrieve data",
            errorMessage:e.message,
            errorStack:e.stack
        })
    }

    return response;
}


const getTaskByMemberId = async (event) =>{
    const response = { statusCode:200}

    try {

        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ memberId:parseInt(event.pathParameters.memberId)}),
        }

        const {Item } = await client.send(new GetItemCommand(params))

        console.log("Item",{Item})
        response.body = JSON.stringify({
            message:"Data retrieved",
            data:(Item) ? unmarshall(Item):{},
            rawData: Item
        })

        console.log("response.body",response.body)

    }catch(e){
        console.error(e);
        response.statusCode = 500
        response.body = JSON.stringify({
            message:"Failed to retrieve data",
            errorMessage:e.message,
            errorStack:e.stack
        })
    }

    return response;
}

const createTask = async (event) =>{
    const response = { statusCode:200}

    try {
        const specialChars = /[`!@$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
        const body = JSON.parse(event.body)
        body.DateCreated = new Date().toLocaleString()
        body.DateAssigned = ""
        body.DateCompleted = ""
        body.DateClosed = ""
        body.CreatedBy = "Team-Lead"
        body.Status = "Draft"
        if(body.AssignedTo && Number.isInteger(body.AssignedTo)){
            body.Status = "Assigned"
        }else{
            body.AssignedTo = 0
        }

        if(!body.Title || !body.taskId){
            throw { message : "Please provide taskId or Title"}
        }
        if(body.Title.length < 3 || specialChars.test(body.Title)){
            throw {message:"Length of Title should be minimum 3 character and No special char allowed except # and _"}
        }
        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(body || {}),
        }

        const CreateResult = await client.send(new PutItemCommand(params))

        console.log("CreateResult",CreateResult)
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

    return response;
}

const updateTask = async (event) =>{
    const response = { statusCode:200}

    try {
        const body = JSON.parse(event.body)
        const objKeys = Object.keys(body)
        

        const {Item } = await client.send(new GetItemCommand(
            {
                TableName:process.env.DYNAMODB_TABLE_NAME,
                Key: marshall({ taskId:parseInt(event.pathParameters.taskId)}),
            }
        ))
        console.log("itemm in update task ",Item)
        if(Item.Status == "Closed"){
            throw {message:"Task is Closed, You can not perform any operations"}
        }

        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({taskId:parseInt(event.pathParameters.taskId)}),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
            //ConditionExpression:`Status !=${{'S':'Close'}}`
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

    return response;
}

const assignTask = async (event) =>{
    const response = { statusCode:200}

    try {
        // const body = JSON.parse(event.body)
        // const objKeys = Object.keys(body)
        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({
                taskId:parseInt(event.pathParameters.taskId),
               
            }),
            UpdateExpression: 'SET AssignedTo = :memberId, DateAssigned = :assigned , #key = :status',
            ExpressionAttributeNames: {
                '#key':'Status'
            },
            ExpressionAttributeValues: marshall({
                ':memberId' : `${parseInt(event.pathParameters.memberId)}`,
                ':assigned' : new Date().toLocaleString(),
                ':status':"Assigned"
            }),
        }

        const assignTaskResult = await client.send(new UpdateItemCommand(params))

        console.log(assignTaskResult)
        response.body = JSON.stringify({
            message:"Task Updated succesfully",
            assignTaskResult
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

    return response;
}

const acceptTask = async (event) =>{
    const response = { statusCode:200}

    try {
       

        const {Item} = await client.send(new GetItemCommand({
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ taskId:parseInt(event.pathParameters.taskId)}),
        }))
        let data = (Item) ? unmarshall(Item):""
        if (data == ""){
            throw {message:"Data not found"}
        }else if(data.AssignedTo !== parseInt(event.pathParameters.memberId)){
            throw {message:"You are not authorize to update, please use your memberid"}
        }
        
        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({
                taskId:parseInt(event.pathParameters.taskId)
                
            }),
            UpdateExpression: 'SET #key = :status',
            ExpressionAttributeNames: {
                '#key':'Status'
            },
            ExpressionAttributeValues: marshall({
                ':status' : 'In-progress'
            }),
        }

        const acceptTaskResult = await client.send(new UpdateItemCommand(params))

        console.log(acceptTaskResult)
        response.body = JSON.stringify({
            message:"Task Updated succesfully",
            acceptTaskResult
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

    return response;
}

const completeTask = async (event) =>{
    const response = { statusCode:200}

    try {
        // const body = JSON.parse(event.body)
        // const objKeys = Object.keys(body)
        // Fetch Task Data and check if correct member updating data
        const {Item} = await client.send(new GetItemCommand({
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ taskId:parseInt(event.pathParameters.taskId)}),
        }))
        let data = (Item) ? unmarshall(Item):""
        if (data == ""){
            throw {message:"Data not found"}
        }else if(data.AssignedTo !== parseInt(event.pathParameters.memberId)){
            throw {message:"You are not authorize to update, please use your memberid"}
        }

        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({taskId:parseInt(event.pathParameters.taskId)}),
            UpdateExpression: 'SET #key = :status',
            ExpressionAttributeNames: {
                '#key':'Status'
            },
            ExpressionAttributeValues: marshall({
                ':status' : 'Completed'
            }),
        }

        const completeTaskResult = await client.send(new UpdateItemCommand(params))

        console.log(completeTaskResult)
        response.body = JSON.stringify({
            message:"Task Updated succesfully",
            completeTaskResult
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

    return response;
}

const closeTask = async (event) =>{
    const response = { statusCode:200}

    try {
        const {Item} = await client.send(new GetItemCommand({
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ taskId:parseInt(event.pathParameters.taskId)}),
        }))
        let data = (Item) ? unmarshall(Item):""
        if (data == ""){
            throw {message:"Data not found"}
        }else if(data.AssignedTo !== parseInt(event.pathParameters.memberId)){
            throw {message:"You are not authorize to update, please use your memberid"}
        }
        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({taskId:parseInt(event.pathParameters.taskId)}),
            UpdateExpression: 'SET #key = :status , DateClosed = :closed',
            ExpressionAttributeNames: {
                '#key':'Status'
            },
            ExpressionAttributeValues: marshall({
                ':status' : 'Closed',
                ':closed' : new Date().toLocaleString()
            }),
        }

        const closeTaskResult = await client.send(new UpdateItemCommand(params))

        console.log(closeTaskResult)
        response.body = JSON.stringify({
            message:"Task Updated succesfully",
            closeTaskResult
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

    return response;
}

const deleteTask = async (event) =>{
    const response = { statusCode:200}

    try {
        const params = {
            TableName:process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({taskId:parseInt(event.pathParameters.taskId)}),
            
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
    return response;
}

const getAllTasksByMember = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            FilterExpression:"AssignedTo=:memberId",
            ExpressionAttributeValues:{
                ":memberId": {N: `${parseInt(event.pathParameters.memberId)}`},
            }
        }
        const { Items } = await client.send(new ScanCommand(params));

        response.body = JSON.stringify({
            message: "Successfully retrieved all tasks.",
            data: Items.map((item) => unmarshall(item)),
            Items,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve posts.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};


module.exports = {
    getTaskByTaskId,
    getTaskByMemberId,
    createTask,
    updateTask,
    deleteTask,
    acceptTask,
    closeTask,
    getAllTasksByMember,
    completeTask,
    assignTask

}