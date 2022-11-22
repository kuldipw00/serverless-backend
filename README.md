# serverless-backend

![serverless-diagram](https://user-images.githubusercontent.com/69000290/203208595-37dfe8c6-45ac-4187-94c7-a509de54ddbf.png)


## Following are aws hosted API's
  ### Get specific task details 

      GET: https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}
      
  ### Get task by memebr Id
  
      GET : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/member/{memberId}
      
  ### Create Task: Provide taskId,Title and Description in body.
  
      POST : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task
      Header : x-api-key = cnZ9jO9fxT298Z8WPAUyu5b36EghXM1V6zwDkmTq
     
  ### Update Task : Provide Title and Description
  
      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}
      Header : x-api-key = cnZ9jO9fxT298Z8WPAUyu5b36EghXM1V6zwDkmTq
      
  ### Assign Task : 

      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}/assign/{memberId}
      Header : x-api-key = cnZ9jO9fxT298Z8WPAUyu5b36EghXM1V6zwDkmTq
      
  ### Accept Task : 
      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}/accept/{memberId}
      
  ### Complete Task:

      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}/complete/{memberId}
      
  ### Close Task:

      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}/close/{memberId}
      
  ### Delete Task:

      DELETE : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}
      
  ### Following is POSTMAN collection json:
  
      [postman-collection-json.docx](https://github.com/kuldipw00/serverless-backend/files/10063639/postman-collection-json.docx)   
      
  #### NOTE : 
       Task title should be greater than 3 char and no special char allowed except # and _
       Member can update task which is assigned to them only
       Only team-lead can create and assign task (need to provide API key)
       A closed task cannot be changed
       taskId need to provide manually
   

# Getting Started

## Clone Repo
    git clone https://github.com/kuldipw00/serverless-backend.git

## Install Dependencies
    npm install

## Configure AWS credentials
    aws configure

## Deploy
    serverless deploy

## CI/CD
    Also configured github actions, put aws credentials in settings of github action and then make changes in workflow/main.yaml.
