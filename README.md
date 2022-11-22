# serverless-backend

![serverless-diagram](https://user-images.githubusercontent.com/69000290/203208595-37dfe8c6-45ac-4187-94c7-a509de54ddbf.png)


## Following are aws hosted API's
  ### Get Task details of specific task

      GET: https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}
      
  ### Create Task: Provide necessary details in body.
  
      POST : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task
      Header : x-api-key = cnZ9jO9fxT298Z8WPAUyu5b36EghXM1V6zwDkmTq
     
  ### Update Task : 
  
      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}
      
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