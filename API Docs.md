# Individual Project Phase 2

## List of available endpoints

1. POST /login
2. POST /google-login
3. POST /register

**Below end point need authentication**

4. GET /users/info
5. PATCH /users/telegram

6. GET /projects
7. POST /projects
8. GET /projects/:id
9. PATCH /projects/:id
10. DELETE /projects/:id

11. GET /projects/:ProjectId/task
12. POST /projects/:ProjectId/task
13. GET /tasks/:id
14. PATCH /tasks/:id
15. DELETE /tasks/:id

## API Docs

- **POST /login**

  Description:

  > Take user credential and compare it to database.

  Request Body:

  ```json
  {
    "email": "<string>",
    "password": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "message": "Login successful.",
    "token": "<string>",
    "user": {
      "id": <integer>,
      "name": "<string>",
      "email": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  }
  ```

  Response (400 - Bad Request), (401 - Unauthorized), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **POST /google-login**

  Description:

  > Add new user using google credential.

  Request Header:

  ```json
  {
    "token": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "message": "Login successful.",
    "token": "<string>",
    "user": {
      "id": <integer>,
      "name": "<string>",
      "email": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  }
  ```

  Response (401 - Unauthorized), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **POST /register**

  Description:

  > Add new user to database.

  Request Body:

  ```json
  {
    "name": "<string>",
    "email": "<string>",
    "password": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "message": "Registration successful.",
    "user": {
        "id": <integer>,
        "name": "<string>",
        "email": "<string>",
        "updatedAt": "<string>",
        "createdAt": "<string>"
    }
  }
  ```

  Response (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **GET /users/info**

  Description:

  > Get logged user info.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "id": <integer>,
    "name": "<string>",
    "email": "<string>"
  }
  ```

  Response (401 - Unauthorized), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **PATCH /users/telegram**

  Description:

  > Update field users TelegramChatId.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Request Body:

  ```json
  {
    "TelegramChatId": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "message": "Telegram Chat ID updated successfully",
    "TelegramChatId": "<string>"
  }
  ```

  Response (401 - Unauthorized), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **GET /projects**

  Description:

  > Get all user project.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  [
    {
      "id": <integer>,
      "name": "<string>",
      "description": "<string>",
      "UserId": <integer>,
      "createdAt": "<string>",
      "updatedAt": "<string>"
    },
    ...
  ]
  ```

  Response (401 - Unauthorized), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **POST /projects**

  Description:

  > Add new project to database.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Request Body:

  ```json
  {
    "name": "<string>",
    "description": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "id": <integer>,
    "name": "<string>",
    "description": "<string>",
    "UserId": <integer>,
    "updatedAt": "<string>",
    "createdAt": "<string>"
  }
  ```

  Response (400 - Bad Request), (401 - Unauthorized), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **GET /projects/:id**

  Description:

  > Get user project by id.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
    {
      "id": <integer>,
      "name": "<string>",
      "description": "<string>",
      "UserId": <integer>,
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ```

  Response (401 - Unauthorized), (403 - Forbidden Access), (404 - Not Found), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **PATCH /projects/:id**

  Description:

  > Edit user project by id.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Request Body:

  ```json
  {
    "name": "<string>",
    "description": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
    {
      "id": <integer>,
      "name": "<string>",
      "description": "<string>",
      "UserId": <integer>,
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ```

  Response (400 - Bad Request), (401 - Unauthorized), (403 - Forbidden Access), (404 - Not Found), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

  - **DELETE /projects/:id**

  Description:

  > Delete user project by id.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "message": "<string>"
  }
  ```

  Response (401 - Unauthorized), (403 - Forbidden Access), (404 - Not Found), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **GET /projects/:ProjectId/tasks**

  Description:

  > Get all user task from selected project.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  [
    {
        "id": <integer>,
        "title": "<string>",
        "description": "<string>",
        "status": "<string>",
        "priority": "<string>",
        "dueDate": "<string>",
        "WhatsappNotified": "<boolean>",
        "ProjectId": <integer>,
        "createdAt": "<string>",
        "updatedAt": "<string>"
    },
    ...
  ]
  ```

  Response (401 - Unauthorized),(404 - Not Found), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **POST /projects/:ProjectId/tasks**

  Description:

  > Add new task selected project to database.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Request Body:

  ```json
  {
    "title": "<string>",
    "description": "<string>",
    "status": "<string>",
    "priority": "<string>",
    "dueDate": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "id": <integer>,
    "title": "<string>",
    "description": "<string>",
    "status": "<string>",
    "priority": "<string>",
    "dueDate": "<string>",
    "WhatsappNotified": "<boolean>",
    "ProjectId": <integer>,
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
  ```

  Response (400 - Bad Request), (401 - Unauthorized), (404 - Not Found) (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **GET /projects/:ProjectId/tasks/:id**

  Description:

  > Get project task by id.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "id": <integer>,
    "title": "<string>",
    "description": "<string>",
    "status": "<string>",
    "priority": "<string>",
    "dueDate": "<string>",
    "WhatsappNotified": "<boolean>",
    "ProjectId": <integer>,
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
  ```

  Response (401 - Unauthorized), (403 - Forbidden Access), (404 - Not Found), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

- **PATCH /projects/:id**

  Description:

  > Edit user task by id.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Request Body:

  ```json
  {
    "title": "<string>",
    "description": "<string>",
    "status": "<string>",
    "priority": "<string>",
    "dueDate": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "id": <integer>,
    "title": "<string>",
    "description": "<string>",
    "status": "<string>",
    "priority": "<string>",
    "dueDate": "<string>",
    "WhatsappNotified": "<boolean>",
    "ProjectId": <integer>,
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
  ```

  Response (400 - Bad Request), (401 - Unauthorized), (403 - Forbidden Access), (404 - Not Found), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```

  - **DELETE /projects/:ProjectId/tasks/:id**

  Description:

  > Delete user task by id.

  Request Headers:

  ```json
  {
    "Authorization": "<string>"
  }
  ```

  Response (200 - OK):

  ```json
  {
    "message": "<string>"
  }
  ```

  Response (401 - Unauthorized), (403 - Forbidden Access), (404 - Not Found), (500 - Internal Server Error):

  ```json
  {
    "message": "<string>"
  }
  ```
