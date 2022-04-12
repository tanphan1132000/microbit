def DHT11():
    global count_DHT11, Temp_value, Humi_value
    count_DHT11 += 1
    if count_DHT11 == 200:
        NPNBitKit.dht11_read(DigitalPin.P0)
        Temp_value = NPNBitKit.dht11_temp()
        Humi_value = NPNBitKit.dht11_hum()
        serial.write_string("!7:TEMP:" + ("" + str(Temp_value)) + "#" + "!7:HUMI:" + ("" + str(Humi_value)) + "#")
        count_DHT11 = 1
def IRsensor():
    global count_IR, IRValue
    count_IR += 1
    if count_IR == 14 and isIRsensor == 1:
        IRValue = pins.analog_read_pin(AnalogPin.P4)
        if IRValue <= 800:
            ir_state[1] = parse_float("1")
        else:
            ir_state[1] = parse_float("0")
        if ir_state[1] != ir_state[0]:
            serial.write_string("!16:INFRARED:" + ("" + str(ir_state[1])) + "#")
            ir_state[0] = ir_state[1]
        count_IR = 1
def Gas():
    global count_GAS, gas_raw, gas_percent
    count_GAS += 1
    if count_GAS == 150:
        gas_raw = pins.analog_read_pin(AnalogPin.P10)
        gas_percent = Math.map(gas_raw, 0, 1023, 0, 100)
        serial.write_string("!23:GAS:" + ("" + str(gas_percent)) + "#")
        count_GAS = 1

def on_data_received():
    global temporary, isIRsensor
    temporary = serial.read_until(serial.delimiters(Delimiters.HASH))
    NPNLCD.clear()
    NPNLCD.show_string(temporary, 0, 0)
    if temporary == "IR:OFF":
        isIRsensor = 0
    if temporary == "IR:ON":
        isIRsensor = 1
        NPNLCD.show_number(isIRsensor, 0, 1)
    if temporary == "LIGHT:ON":
        pins.digital_write_pin(DigitalPin.P5, 1)
        pins.digital_write_pin(DigitalPin.P6, 1)
    if temporary == "LIGHT:OFF":
        pins.digital_write_pin(DigitalPin.P5, 0)
        pins.digital_write_pin(DigitalPin.P6, 0)
serial.on_data_received(serial.delimiters(Delimiters.HASH), on_data_received)

temporary = ""
gas_percent = 0
gas_raw = 0
IRValue = 0
Humi_value = 0
Temp_value = 0
ir_state: List[number] = []
count_IR = 0
count_GAS = 0
count_DHT11 = 0
isIRsensor = 0
led.enable(False)
NPNLCD.lcd_init()
pins.digital_write_pin(DigitalPin.P5, 0)
pins.digital_write_pin(DigitalPin.P6, 0)
isIRsensor = 1
count_DHT11 = 1
count_GAS = 1
count_IR = 1
ir_state = [0, 0]
NPNLCD.show_string("Xin Chao", 0, 0)

def on_forever():
    IRsensor()
    DHT11()
    Gas()
    basic.pause(100)
basic.forever(on_forever)
