function DHT11 () {
    count_DHT11 += 1
    if (count_DHT11 == 50) {
        NPNBitKit.DHT11Read(DigitalPin.P0)
        serial.writeString("!7:TEMP:" + ("" + NPNBitKit.DHT11Temp()) + "#")
        serial.writeString("!7:HUMI:" + ("" + NPNBitKit.DHT11Hum()) + "#")
        count_DHT11 = 1
    }
}
function gas () {
    count_gas += 1
    if (count_gas == 30) {
        gas_raw = pins.analogReadPin(AnalogPin.P2)
        gas_percent = Math.map(gas_raw, 0, 1023, 0, 100)
        serial.writeString("!23:GAS:" + ("" + gas_percent) + "#")
        count_gas = 1
    }
}
function IRsensor () {
    if (isIRsensor == true) {
        serial.writeString("!16:INFRARED:" + ("" + pins.digitalReadPin(DigitalPin.P4)) + "#")
    }
}
serial.onDataReceived(serial.delimiters(Delimiters.Hash), function () {
    temp = serial.readUntil(serial.delimiters(Delimiters.Hash))
    if (temp == "IR:OFF") {
        isIRsensor = false
    } else if (temp == "IR:ON") {
        isIRsensor = true
    } else if (temp == "LIGHT:ON") {
        pins.digitalWritePin(DigitalPin.P6, 1)
    } else if (temp == "LIGHT:OFF") {
        pins.digitalWritePin(DigitalPin.P6, 0)
    }
})
let temp = ""
let gas_percent = 0
let gas_raw = 0
let count_gas = 0
let count_DHT11 = 0
let isIRsensor = false
led.enable(false)
isIRsensor = true
count_DHT11 = 1
count_gas = 1
let count_IR = 1
basic.forever(function () {
    DHT11()
    gas()
    IRsensor()
    basic.pause(100)
})
