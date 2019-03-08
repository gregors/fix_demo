import FIXParser, {
  Field,
  Fields,
  Messages,
  Side,
  OrderTypes,
  HandlInst,
  TimeInForce,
  EncryptMethod
} from 'fixparser'

const sender = ''
const target = ''
const host = ''
const port = 5555
const fixVersion = 'FIX.4.4'
const senderCompId = ''
const targetCompId = ''
const password = ''

const fixParser = new FIXParser()

fixParser.connect({
  host: host,
  port: port,
  protocol: 'tcp',
  sender: sender,
  target: target,
  fixVersion: fixVersion
})

fixParser.on('open', () => {
  console.log('>>>>>>> fix open')
  sendLogon()
})

fixParser.on('message', message => {
  messageRouter(message)
})

// Disconnected...
fixParser.on('close', () => { })

function messageRouter(message) {
  switch (message.messageType) {
    case "0": // heartbeat
      sendHeartBeat(message)
      break
    case "1": // test message
      sendHeartBeat(message)
      break
    default:
      console.log("message", message.messageType)
  }
}

function sendLogon() {
  const logon = fixParser.createMessage(
    new Field(8, fixVersion),
    new Field(Fields.MsgType, Messages.Logon),
    new Field(Fields.MsgSeqNum, fixParser.getNextTargetMsgSeqNum()),
    new Field(Fields.SenderCompID, senderCompId),
    new Field(Fields.SendingTime, fixParser.getTimestamp()),
    new Field(Fields.TargetCompID, targetCompId),
    new Field(Fields.ResetSeqNumFlag, 'Y'),
    new Field(Fields.EncryptMethod, EncryptMethod.None),
    new Field(Fields.HeartBtInt, 10),
    new Field(553, 'test_2'),
    new Field(554, password)
  )
  const messages = fixParser.parse(logon.encode())
  console.log('>>>sending logon', messages[0].description, messages[0].string)
  fixParser.send(logon)
}

function sendHeartBeat(message) {
  const heartbeat = fixParser.createMessage(
    new Field(8, fixVersion),
    new Field(Fields.MsgType, Messages.Heartbeat),
    new Field(Fields.SenderCompID, senderCompId),
    new Field(Fields.TargetCompID, targetCompId),
    new Field(Fields.MsgSeqNum, fixParser.getNextTargetMsgSeqNum()),
    new Field(Fields.SendingTime, fixParser.getTimestamp()),
  )
  console.log('>>>sending heartbeat', heartbeat.encode())
  fixParser.send(heartbeat)
}

//function sendSubcribe() {
//  const subscribeMessage = fixParser.createMessage(
//    new Field(Fields.MsgType, Messages.NewOrderSingle),
//    new Field(Fields.MsgSeqNum, fixParser.getNextTargetMsgSeqNum()),
//    new Field(Fields.SenderCompID, senderCompId),
//    new Field(Fields.SendingTime, fixParser.getTimestamp()),
//    new Field(Fields.TargetCompID, targetCompId),
//    new Field(Fields.ClOrdID, '11223344'),
//    new Field(Fields.HandlInst, HandlInst.AutomatedExecutionNoIntervention),
//    new Field(Fields.OrderQty, '123'),
//    new Field(Fields.TransactTime, fixParser.getTimestamp()),
//    new Field(Fields.OrdType, OrderTypes.Market),
//    new Field(Fields.Side, Side.Buy),
//    new Field(Fields.Symbol, '700.HK'),
//    new Field(Fields.TimeInForce, TimeInForce.Day),
//    new Field(553, 'test_2'),
//    new Field(554, password)
//  )
//
//
//  const messages = fixParser.parse(subscribeMessage.encode())
//  console.error('sending message', messages[0].description, messages[0].string)
//  fixParser.send(subscribeMessage)
//}
