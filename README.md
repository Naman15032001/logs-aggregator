# LOGS AGGREGATOR SERVICE

# Service
This a simple REST API BASED LOG AGGREGATOR . Tech Stack NodeJS/ Express / MonogDB

## Requirements

- Node.js
-  or Docker =

## Clone the repository and install dependencies

```
//on local
git clone https://github.com/Naman15032001/logs-aggregator
cd logs-aggregator
npm install
```


# Usage

```
npm start
// for docker first build and then run
```



## CURLS

```
curl --location 'http://localhost:8002/api/v1/ingest' \
--header 'Content-Type: application/json' \
--data '[
    {
        "time": 1685426738,
        "log": "lorem4 lipsm"
    },
    {
        "time": 1685426739,
        "log": "lorem4 lipsm"
    },
    {
        "time": 1685426738,
        "log": "lorem4 lipsm"
    }
]'
```

```
curl --location 'http://localhost:8002/api/v1/query?start=1709211728659&end=1909211728659&text=lorem4' \
--data ''
```

## ENDPOINT 

- `GET /query?start=1709211728659&end=1909211728659&text=lorem4 - SEARCH LOGS IN AWS S3
- `POST /ingest -> INJEST JSON LOGS ON AWS S3
  

## Design
service: logs aggregator-service

code flow
ROUTE -> AGGREGATOR CONTROLLER -> AGGREGATOR SERVICE - S3 UTILS

FOR EFFICENT USAGE OF AWS S3 USED STREAMS TO READ object DATA . 
ALSO USED PAGINATION APPROACH SO ALL FILENAMES ARE NOT IN MEMORY

IMPROVEMENTS THAT CAN BE MADE

1) STORE AWS FILENAME IN DB IN WHICH WE CAN INDEX TO GET FILENAMES 
2) GET FILENAMES OF AWS THROUGH QUERYING
3) PROCESS MULTIPLE FILES PARALLELY USING Promise.all

## Trade-offs made
  - Security aspect of the project 

## Assumptions made
  - No authentication required
  - No HTTPS server required

## Changes for production
  - Horizontal scaling of this app (Eg HPA in kubernetes)
  - Robust Error Handling and seperate data validation layer as 
    middleware
  - Better Configuration management for different envs 
    
