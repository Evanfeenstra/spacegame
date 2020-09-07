var token = 'WBr1PxYIalHureL5OiUtdT5gNQj385FSwVHaiwIhHfBWhaQVhydkh8oSMvMIpfpL'

function connectToFlespi() {
  var mqttURL = 'wss://mqtt.flespi.io'
  client = mqtt.connect(mqttURL, { username: token })
  client.on('connect', () => {
    initialMsg()
    client.subscribe('messages')
    client.on('message', function (t, b) {
      try {
        var hi = new TextDecoder("utf-8").decode(b)
        var yo = JSON.parse(hi)
        incomingMessage(yo)
      } catch (e) { }
    })
  })
}

function initialMsg() {
  send({
    mode: 'join',
    x: ship.position.x,
    y: ship.position.y
  })
}

function send(m) {
  if (m && client) {
    m.id = uid
    client.publish("messages", JSON.stringify(m))
  }
}

function incomingMessage(m) {
  if (m.id == uid) return // skip if its from me

  if (m.mode == 'join') {
    players[m.id] = makeShip(m.x, m.y)
    send({
      mode: 'here',
      x: ship.position.x,
      y: ship.position.y,
      r: ship.rotation
    })
  }
  if (m.mode == 'here') {
    if (!players[m.id]) {
      players[m.id] = makeShip(m.x, m.y)
      players[m.id].rotation = m.r
    }
  }
  if (m.mode == 'turn') {
    players[m.id].rotation += m.angle
  }
  if (m.mode == 'fly') {
    players[m.id].addSpeed(0.2, players[m.id].rotation - 90)
  }
  if (m.mode == 'fire') {
    fireLaser(m.x, m.y, m.r, enemyLasers)
    players[m.id].position.x = m.x
    players[m.id].position.y = m.y
    players[m.id].rotation = m.r
  }
  if (m.mode == 'boom') {
    players[m.id].changeAnimation('boom')
    players[m.id].life = 20
  }
} // end doStuff