# Im

- 一个聊天的后台服务,有两个子项目, 一个是 server,另一个是 im
- [server-前端(uniap)](https://github.com/wxiain/forthwith)
- im + [ ] 未开发

## 安装

```bash
$ yarn|npm install
```

## 运行项目

- server

```bash
# development
$ yarn start-server

# watch mode
$ yarn start-server:dev

#build
nest build server

```

## 一些说明

### server

- [接口文档](https://api.wxiain.com/), 注册后联系我 QQ: 30078832263(请注明来意,欢迎提出问题,大家一起学习进步)
- 由于 yapi 文档不支持 websocket 接口, 所以我在下面补齐

```javascript
let websocket = new Websocket('ws://localhost:8080', [token]);
// 1.这里token过期或者没带, 会被服务端主动关闭该次连接
// 2. 由于websocket上没有心跳连接, 所以在连接服务失败时, 可能需要重连
websocket.onopen = function() {
    // 消息发送
    websocket.send(JSON.stringify({
      event: 'message',
      data: {
          send_id: 1,// 发送方id
          receive_id: 2, // 接收方id
          message: '111', // 消息内容
      },
    }))
    // 消息已读, 也就是减去消息列表上的unread_count
    websocket.send(JSON.stringify({event: 'readed', data: {
        link_id: 1// 消息列表id
    }})
    // 消息接收(如果是好友同意, 那么申请方也会接收到, 此时建议刷新friends/list接口)
    websocket.onmessage((data) => {
        // data.type 消息类型 message|notification
        // data.message 消息内容
        // data.send_id 发送方id
        // data.receive_id 接收方id
        // data.link_id 消息列表id
        // data.message_id 消息记录id
        // data.update_at 消息记录更新时间
        // data.create_at 消息记录创建时间
    })
}
```

### libs

- 包含 auth 和 db(mysql)两个公共模块

## License

Nest is [MIT licensed](LICENSE).
