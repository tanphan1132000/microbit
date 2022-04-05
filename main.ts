function DHT11 () {
    count_DHT11 += 1
    if (count_DHT11 == 50) {
        NPNBitKit.DHT11Read(DigitalPin.P0)
        temp_state[1] = NPNBitKit.DHT11Temp()
        humi_state[1] = NPNBitKit.DHT11Hum()
        if (temp_state[1] != temp_state[0]) {
            serial.writeString("!7:TEMP:" + ("" + NPNBitKit.DHT11Temp()) + "#")
            temp_state[0] = NPNBitKit.DHT11Temp()
        }
        if (humi_state[1] != humi_state[0]) {
            serial.writeString("!7:HUMI:" + ("" + NPNBitKit.DHT11Hum()) + "#")
            humi_state[0] = NPNBitKit.DHT11Hum()
        }
        count_DHT11 = 1
    }
}
function IRsensor () {
    count_IR += 1
    if (count_IR == 10 && isIRsensor == true) {
        IRValue = pins.analogReadPin(AnalogPin.P4)
        ir_state[1] = IRValue
        if (ir_state[1] != ir_state[0]) {
            let list: number[] = []
            serial.writeString("!16:INFRARED:" + ("" + IRValue) + "#")
            list[0] = IRValue
        }
        count_IR = 1
    }
}
function Gas () {
    count_gas += 1
    if (count_gas == 30) {
        gas_raw = pins.analogReadPin(AnalogPin.P10)
        gas_percent = Math.map(gas_raw, 0, 1023, 0, 100)
        gas_state[1] = gas_percent
        if (gas_state[1] != gas_state[0]) {
            serial.writeString("!23:GAS:" + ("" + gas_percent) + "#")
            gas_state[0] = gas_percent
        }
        count_gas = 1
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
let IRValue = 0
let ir_state: number[] = []
let gas_state: number[] = []
let humi_state: number[] = []
let temp_state: number[] = []
let count_IR = 0
let count_gas = 0
let count_DHT11 = 0
let isIRsensor = false
led.enable(false)
isIRsensor = true
count_DHT11 = 1
count_gas = 1
count_IR = 1
temp_state = [0, 0]
humi_state = [0, 0]
gas_state = [0, 0]
ir_state = [0, 0]
basic.forever(function () {
    DHT11()
    Gas()
    IRsensor()
    basic.pause(100)
})
