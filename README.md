# serverless-backend

![serverless-diagram](https://user-images.githubusercontent.com/69000290/203208595-37dfe8c6-45ac-4187-94c7-a509de54ddbf.png)


# Following are aws hosted API's
  1. Get Task details of specific task
      https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}
      
  2. Create Task: Provide necessary details in body.
  
      POST : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task
      Header : x-api-key = cnZ9jO9fxT298Z8WPAUyu5b36EghXM1V6zwDkmTq
     
  3. Update Task : 
  
      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}
      
  4. Assign Task : 
      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}/assign/{memberId}
      
  5. Accept Task : 
      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}/accept/{memberId}
      
  6. Complete Task:
      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}/complete
      
  7. Close Task:
      PUT : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}/close
      
  8. Delete Task:
      DELETE : https://enhllfxyl4.execute-api.us-west-1.amazonaws.com/dev/task/{taskId}
   


1. Install Dependencies
npm install

2. Configure AWS credentials
aws configure
