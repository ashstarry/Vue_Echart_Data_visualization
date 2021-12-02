export default class SocketService {

  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

    ws = null
    connected = false
    sendRetryCount = 0
    connectRetryCount = 0

    callBackMapping = {}

    connect() {
        if (!window.WebSocket) return console.log('no support WebSocket');

    this.ws = new WebSocket('ws://101.34.160.195:9998')

        // this.ws = new WebSocket('ws://101.34.160.195:9998')


        this.ws.onopen = () => {
      this.connected = true
      this.connectRetryCount = 0
      console.log('connection success');
    }

        this.ws.onmessage = (msg) => {
            const recvData = JSON.parse(msg.data)
                  const socketType = recvData.socketType
            if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
                    const realData = JSON.parse(recvData.data)
                    this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
                    this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
                    this.callBackMapping[socketType].call(this, recvData)
        }
      }

    }

        this.ws.onerror = () => {
      this.connected = false
      console.log('connection fail');
    }

        this.ws.onclose = () => {
      this.connectRetryCount++
      this.connected = false
      console.log('connection close');
      setTimeout(() => {
        this.connect()
      }, this.connectRetryCount * 500);
    }
  }

  /**
   * register callback
   * @param {socketType}  
   * @param {*} callback 
   */
  registerCallBack(socketType, callback) {
    this.callBackMapping[socketType] = callback
  }

    unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }

    send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
                  this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++

      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500);
    }

  }
}