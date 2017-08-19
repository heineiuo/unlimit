## http request

```mermaid
sequenceDiagram
    CLIENT-->>HTTP: send a request
    activate HTTP
    HTTP-->>CLIENT: response
    deactivate John
```

## http request with db

first, config server db connection

```mermaid
sequenceDiagram
    CLIENT-->>HTTP: send a request
    activate HTTP
    HTTP->>DB: websocket send
    DB->>HTTP: websocket onmessage
    HTTP-->>CLIENT: response
    deactivate John
```

## proxy websocket to db
```mermaid
sequenceDiagram
    CLIENT-->>HTTP: send ws connection
    Note right of HTTP: HTTP is not a ws server
    HTTP->>DB: proxy ws
    HTTP-->>CLIENT: upgrade protocol to ws
    CLIENT->>DB: ws send
    Note right of HTTP: HTTP proxying...
    DB->>CLIENT: ws onmessage
```

## db control http 
```mermaid
sequenceDiagram
    DB-->>HTTP: send http request
    HTTP-->>DB: response
```
