# @unlimit/http

## Flowchat 

mermaid:
```mermaid
graph TD
  id1[Requet] --> id2[Router]
  id2 --> id3{Check domain}
  id3 -->|IP address return 403| id4[Respose]
  id3 -->|Not found return 404| id4
  id3 --> |Found| id5(Target router)
  id5 --> |JQL| id6((JQL sandbox))
  id5 --> |Static folder| id7((express.static))
  id5 --> |Static file| id10((sendFile))
  id5 --> |http proxy| id8((http-proxy))
  id5 --> |ws proxy| id9((ws-proxy))


```

Every unit of router is a cached function named `$domain/$functionName`, static proxy/ws proxy/static folder/file will be virtualed as a internal function to be able to called by user functions.

There will be only two sandbox, one is used to be run client's request JQL, and another is used to run cached functions. Both of them can access the store created with every client request. The JQL sandbox is limited to use little features of js and node.js, and the user function sandbox can use much more feature and be able to access the full store.

The store creator and sandbox is always stable because they're written in core. the JQL and the user functions is not stable because then can be upgrade, remove or  overwritten anytime.
