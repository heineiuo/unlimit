# Gateway

High performance, rich features cloud system kernel.

* 作为客户端和服务群的中间桥梁
  * 接受客户端http请求，分发给合适的服务
  * 接受客户端ws连接，维持连接状态
    * 提供服务端发送消息给指定连接的功能
    * 接受消息，并分发给合适的服务
  * 服务注册和状态更新
    * 注册需要双向验证
  * 主动寻找服务
    * 由于服务不一定注册在这个服务器上，需要寻找其他服务器上的服务
  * 集成客户端请求配置服务，注册服务名`gateway`

## Feature

* CNAME Service
* HTTPS Support
* Web File Manage
    * View
    * Edit
    * Upload
    * Download
* Domain
    * port proxy
    * static file proxy
    * special file type editor online
    * seashell protocol
* Monitor

## Get Start

1. clone this repo.
```bash
git clone https://github.com/heineiuo/gateway
```

2. install packages
```bash
npm install
```

3. build
```base
npm run build
```

4. start
```base
sudo npm run start
```

## Web Operate UI


## Custom


## License

* Free for no-business usage.
* If you want to use it in business, please contact [heineiuo@gmail.com](heineiuo@gmail.com).