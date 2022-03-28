def DHT11():
    global count_DHT11
    count_DHT11 += 1
    if count_DHT11 == 50:
        NPNBitKit.dht11_read(DigitalPin.P0)
        serial.write_string("!7:TEMP:" + str(NPNBitKit.dht11_temp()) + "#")
        serial.write_string("!7:HUMI:" + str(NPNBitKit.dht11_hum()) + "#")
        count_DHT11 = 1
def gas():
    global count_gas, gas_raw, gas_percent
    count_gas += 1
    if count_gas == 30:
        gas_raw = pins.analog_read_pin(AnalogPin.P2)
        gas_percent = Math.map(gas_raw, 0, 1023, 0, 100)
        serial.write_string("!23:GAS:" + str(gas_percent) + "#")
        count_gas = 1
def IRsensor():
    if isIRsensor == True:
        serial.write_string("!16:INFRARED:" + str(pins.digital_read_pin(DigitalPin.P4)) + "#")

def on_data_received():
    global temp, isIRsensor
    temp = serial.read_until(serial.delimiters(Delimiters.HASH))
    if temp == "IR:OFF":
        isIRsensor = False
    elif temp == "IR:ON":
        isIRsensor = True
    elif temp == "LIGHT:ON":
        pins.digital_write_pin(DigitalPin.P6, 1)
    elif temp == "LIGHT:OFF":
        pins.digital_write_pin(DigitalPin.P6, 0)
serial.on_data_received(serial.delimiters(Delimiters.HASH), on_data_received)

temp = ""
gas_percent = 0
gas_raw = 0
count_gas = 0
count_DHT11 = 0
isIRsensor = False
led.enable(False)
isIRsensor = True
count_DHT11 = 1
count_gas = 1
count_IR = 1

def on_forever():
    DHT11()
    gas()
    IRsensor()
    basic.pause(100)
basic.forever(on_forever)
