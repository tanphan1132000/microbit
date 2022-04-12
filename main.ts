function DHT11 () {
    count_DHT11 += 1
    if (count_DHT11 == 250) {
        NPNBitKit.DHT11Read(DigitalPin.P0)
        Temp_value = NPNBitKit.DHT11Temp()
        Humi_value = NPNBitKit.DHT11Hum()
        serial.writeString("!7:TEMP:" + ("" + Temp_value) + "#" + "!7:HUMI:" + ("" + Humi_value) + "#")
        count_DHT11 = 1
    }
}
function IRsensor () {
    count_IR += 1
    if (count_IR == 11 && isIRsensor == 1) {
        IRValue = pins.analogReadPin(AnalogPin.P4)
        if (IRValue <= 800) {
            ir_state[1] = parseFloat("1")
        } else {
            ir_state[1] = parseFloat("0")
        }
        if (ir_state[1] != ir_state[0]) {
            serial.writeString("!16:INFRARED:" + ("" + ir_state[1]) + "#")
            ir_state[0] = ir_state[1]
        }
        count_IR = 1
    }
}
function Gas () {
    count_GAS += 1
    if (count_GAS == 200) {
        gas_raw = pins.analogReadPin(AnalogPin.P10)
        gas_percent = Math.map(gas_raw, 0, 1023, 0, 100)
        serial.writeString("!23:GAS:" + Math.ceil(gas_percent) + "#")
        count_GAS = 1
    }
}
serial.onDataReceived(serial.delimiters(Delimiters.Hash), function () {
    temporary = serial.readUntil(serial.delimiters(Delimiters.Hash))
    NPNLCD.clear()
    NPNLCD.ShowString(temporary, 0, 0)
    if (temporary == "IR:OFF") {
        isIRsensor = 0
    } else if (temporary == "IR:ON") {
        isIRsensor = 1
        count_IR = 1
    } else if (temporary == "LIGHT:ON") {
        pins.digitalWritePin(DigitalPin.P5, 1)
        pins.digitalWritePin(DigitalPin.P6, 1)
    } else if (temporary == "LIGHT:OFF") {
        pins.digitalWritePin(DigitalPin.P5, 0)
        pins.digitalWritePin(DigitalPin.P6, 0)
    }
})
let temporary = ""
let gas_percent = 0
let gas_raw = 0
let IRValue = 0
let Humi_value = 0
let Temp_value = 0
let ir_state: number[] = []
let count_IR = 0
let count_GAS = 0
let count_DHT11 = 0
let isIRsensor = 0
led.enable(false)
NPNLCD.LcdInit()
pins.digitalWritePin(DigitalPin.P5, 0)
pins.digitalWritePin(DigitalPin.P6, 0)
isIRsensor = 1
count_DHT11 = 1
count_GAS = 1
count_IR = 1
ir_state = [0, 0]
NPNLCD.ShowString("Xin Chao", 0, 0)
basic.forever(function () {
    IRsensor()
    Gas()
    DHT11()
    basic.pause(100)
})
