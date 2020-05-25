/** 
 * @file pxt-maqueen/maqueen.ts
 * @brief DFRobot's maqueen makecode library.
 * @n [Get the module here](https://www.dfrobot.com.cn/goods-1802.html)
 * @n This is a MakeCode graphical programming education robot.
 * 
 * @copyright    [DFRobot](http://www.dfrobot.com), 2016
 * @copyright    MIT Lesser General Public License
*/

let maqueencb: Action
let maqueenmycb: Action
let maqueene = "1"
let maqueenparam = 0
let alreadyInit = 0
let IrPressEvent = 0
const MOTER_ADDRESSS = 0x10

/**
 * Line Sensor events 
*/
enum mystate {
 //% block="found" 
 FindLine = 1,
 //% block="lost" 
 LoseLine = 0
    }
enum PingUnit {
    //% block="cm"
    Centimeters,
}
enum state {
        state1=0x10,
        state2=0x11,
        state3=0x20,
        state4=0x21
    }
interface KV {
    key: state;
    action: Action;
}

//% color=#008C8C weight=10 icon="\uf1b9"
namespace ToodleCar {

		 export enum OptDir {
        //% block="forward" enumval=0
        forward,
        //% block="backward" enumval=1
        backward,
        //% block="left" enumval=2
        left,
        //% block="right" enumval=3
        right
    }
	
	 /**
	* Status List of Tracking Modules
	*/
    export enum TrackingState {
        //% block="● ●" enumval=0
        L_R_line,

        //% block="◌ ●" enumval=1
        L_unline_R_line,

        //% block="● ◌" enumval=2
        L_line_R_unline,

        //% block="◌ ◌" enumval=3
        L_R_unline
    }
	
    let kbCallback: KV[] = []

    export class Packeta {
        public mye: string;
        public myparam: number;
    }

    export enum Motors {
        //% blockId="left motor" block="left"
        M1 = 0,
        //% blockId="right motor" block="right"
        M2 = 1,
        //% blockId="all motor" block="all"
        All = 2
    }

    export enum Servos {
        //% blockId="S1" block="S1"
        S1 = 0,
        //% blockId="S2" block="S2"
        S2 = 1
    }

    export enum Dir {
        //% blockId="CW" block="forward"
        CW = 0x0,
        //% blockId="CCW" block="backward"
        CCW = 0x1
    }

    export enum Patrol {
        //% blockId="patrolLeft" block="left"
        PatrolLeft = 13,
        //% blockId="patrolRight" block="right"
        PatrolRight = 14
    }

    export enum Patrol1 {
        //% blockId="patrolLeft" block="left"
        PatrolLeft = 0x10,
        //% blockId="patrolRight" block="right"
        PatrolRight = 0x20
    }
    export enum Voltage {
        //%block="found"
        High = 0x01,
        //% block="lost"
        Low = 0x00
    }


    export enum LEDswitch {
        //% blockId="turnOn" block="on"
        turnOn = 0x01,
        //% blockId="turnOff" block="off"
        turnOff = 0x00
    }
    export enum LED {
        //% blockId="LeftLED" block="Left"
        LeftLED = 8,
        //% blockId="RightLED" block="Right"
        RightLED = 12,
	 //% blockId="BothLED" block="All"
        BothLED = 1
    }
	
    //% advanced=true shim=maqueenIR::initIR
    function initIR(pin: Pins): void {
        return
    }

    //% advanced=true shim=maqueenIR::onPressEvent
    function onPressEvent(btn: RemoteButton, body: Action): void {
        return
    }

    //% advanced=true shim=maqueenIR::getParam
    function getParam(): number {
        return 0
    }

    function maqueenInit(): void {
        if (alreadyInit == 1) {
            return
        }
        initIR(Pins.P16)
        alreadyInit = 1
    }


    function IR_callback(a: Action): void {
        maqueencb = a
        IrPressEvent += 1
        onPressEvent(IrPressEvent, maqueencb)
    }

    /**
     * Read ultrasonic sensor.
     */

    //% blockId=ultrasonic_sensor block="sonar unit |%unit "
    //% weight=95
    //% advanced=true
    export function Ultrasonic(unit: PingUnit, maxCmDistance = 500): number {
        let d
        pins.digitalWritePin(DigitalPin.P1, 0);
        if (pins.digitalReadPin(DigitalPin.P2) == 0) {
            pins.digitalWritePin(DigitalPin.P1, 1);
            pins.digitalWritePin(DigitalPin.P1, 0);
            d = pins.pulseIn(DigitalPin.P2, PulseValue.High, maxCmDistance * 58);
        } else {
            pins.digitalWritePin(DigitalPin.P1, 0);
            pins.digitalWritePin(DigitalPin.P1, 1);
            d = pins.pulseIn(DigitalPin.P2, PulseValue.Low, maxCmDistance * 58);
        }
        let x = d / 39;
        if (x <= 0 || x > 500) {
            return 0;
        }
        switch (unit) {
            case PingUnit.Centimeters: return Math.round(x);
            default: return Math.idiv(d, 2.54);
        }

    }



    /**
     * Read line tracking sensor.
     */

    //% weight=20
    //% blockId=read_Patrol block="read |%patrol line tracking sensor"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
	//% advanced=true
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.PatrolLeft) {
            return pins.digitalReadPin(DigitalPin.P13)
        } else if (patrol == Patrol.PatrolRight) {
            return pins.digitalReadPin(DigitalPin.P14)
        } else {
            return -1
        }
    }

		 /**
     * Read line tracking sensor II.
     */

    //% weight=20
    //% blockId=myread_Patrol block="%patrol line sensor %mystate"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
	//% advanced=true
    export function myreadPatrol(patrol: Patrol, SelectedState: mystate): boolean {
        if (patrol == Patrol.PatrolLeft) {
		
            let LeftPin = pins.digitalReadPin(DigitalPin.P13);
			
			 if (LeftPin == SelectedState) {
            return true;
					} else { return false;}
		
		
        } else if (patrol == Patrol.PatrolRight) {
            let RightPin = pins.digitalReadPin(DigitalPin.P13);
			
			 if (RightPin == SelectedState) {
            return true;
					} else { return false;}
        } else {
            return false;
        }
    }
	
    /**
     * Turn on/off the LEDs.
     */

    //% weight=20
//% blockId=writeLED block="headlights %led|%ledswitch"
    //% led.fieldEditor="gridpicker" led.fieldOptions.columns=2 
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function writeLED(led: LED, ledswitch: LEDswitch): void {
        if (led == LED.LeftLED) {
            pins.digitalWritePin(DigitalPin.P8, ledswitch)
        } else if (led == LED.RightLED) {
            pins.digitalWritePin(DigitalPin.P12, ledswitch)
        } else if (led == LED.BothLED) {
            pins.digitalWritePin(DigitalPin.P12, ledswitch)
			pins.digitalWritePin(DigitalPin.P8, ledswitch)
        }else {
            return
        }
    }


     /**
     * Line tracking sensor event function
     */
    //% weight=2
    //% blockId=kb_event block="on|%value line |%vi"
	//% advanced=true
    export function ltEvent(value: Patrol1, vi: Voltage, a: Action) {
         let state = value + vi;
        serial.writeNumber(state)
        let item: KV = { key: state, action: a };
        kbCallback.push(item);
    }
    let x:number
    let i:number = 1;
    function patorlState():number{
        switch(i){
            case 1: x = pins.digitalReadPin(DigitalPin.P13) == 0 ? 0x10:0;break;
            case 2: x = pins.digitalReadPin(DigitalPin.P13) == 1 ? 0x11:0;break;
            case 3: x = pins.digitalReadPin(DigitalPin.P14) == 0 ? 0x20:0;break;
            default:x = pins.digitalReadPin(DigitalPin.P14) == 1 ? 0x21:0;break;
        }
        i+=1;
        if(i==5)i=1;
        
        return x;
    }

     basic.forever(() => {
        if (kbCallback != null) {
            let sta = patorlState();
            if (sta != 0) {
                for (let item of kbCallback) {
                    if (item.key == sta) {
                        item.action();
                    }
                }
            }
        }
        basic.pause(50);
    })

      /**
    * Pause for the specified time in seconds
    * @param sec how long to pause for, eg: 1, 2, 5
    */
	//% weight=10
    //% block="pause (seconds) $sec"
    export function mypause(sec: number): void {
        basic.pause(sec * 1000);
    }
	
	/**
	* Checks the current status of tracking module. 
	* @param state Four states of tracking module, eg: TrackingState.L_R_line
    */
    //% blockId=ringbitcar_tracking block="tracking state is %state"
	//% advanced=true
    export function tracking(state: TrackingState): boolean {

        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        let left_tracking = pins.digitalReadPin(DigitalPin.P13);
        let right_tracking = pins.digitalReadPin(DigitalPin.P14);
        if (left_tracking == 0 && right_tracking == 0 && state == 0) {
            return true;
        }
        else if (left_tracking == 1 && right_tracking == 0 && state == 1) {
            return true;
        }
        else if (left_tracking == 0 && right_tracking == 1 && state == 2) {
            return true;
        }
        else if (left_tracking == 1 && right_tracking == 1 && state == 3) {
            return true;
        }
        else {
            return false;
        }
    }
	
	/**
    * Choose direction, speed and for how long.
    * @param dir Driving OptDir, eg: OptDir.forward
    * @param speed Running speed, eg: 50
    * @param time Travel time, eg: 3
    */
    //% blockId=move_time block="go %dir at %speed\\% for %time seconds"
   //% speed.min=15 speed.max=100
    export function moveTime(dir: OptDir, speed: number, time: number): void {
	
	 let motorspeed = (Math.abs(speed) * 255) / 100;
	 let Leftspeed = 255;
	 let Rightspeed = 255;
	 let leftmotordirection = 0x1;
	 let rightmotordirection = 0x1;
	 
	   
	   if (dir == 0){
				leftmotordirection = 0x0;  //forwards
				rightmotordirection = 0x0;
				Leftspeed = motorspeed;
				Rightspeed = motorspeed;
	   } 
	   else if (dir == 1){
				leftmotordirection = 0x1;	//backwards
				rightmotordirection = 0x1;
				Leftspeed = motorspeed;
				Rightspeed = motorspeed;
	   } 
	   else if (dir == 2){
				leftmotordirection = 0x1;	//left
				rightmotordirection = 0x0;
				Leftspeed = motorspeed;
				Rightspeed = motorspeed;
	   } else {
				leftmotordirection = 0x0;	//right
				rightmotordirection = 0x1;
				Leftspeed = motorspeed;
				Rightspeed = motorspeed;
	   }
	   
	   
	   
	   let buf = pins.createBuffer(3);

            buf[0] = 0x00;
            buf[1] = leftmotordirection;
            buf[2] = Leftspeed;
            pins.i2cWriteBuffer(0x10, buf);

            buf[0] = 0x02;
            buf[1] = rightmotordirection;
            buf[2] = Rightspeed;
            pins.i2cWriteBuffer(0x10, buf);

		basic.pause(time * 1000);	//pause
		
		 buf[0] = 0x00;		//stop
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
            pins.i2cWriteBuffer(0x10, buf);
    }
	
	   /**
     * Control the speed of left and right wheels. 
     * @param lspeed Left wheel speed , eg: 50
     * @param rspeed Right wheel speed, eg: 50
     */
    //% blockId=elecmotors block="drive: left wheel %lspeed\\% |right wheel %rspeed\\%"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
	//% weight=80
    export function elecmotors(lspeed: number = 50, rspeed: number = 50): void {
	   
	 let Leftspeed = (Math.abs(lspeed) * 255) / 100;
	 let Rightspeed = (Math.abs(rspeed) * 255) / 100;
	 let leftmotordirection = 0x1;
	 let rightmotordirection = 0x1;
	 
	   if (lspeed < 0){
		   leftmotordirection = 0x1;
	   } else {
		   leftmotordirection = 0x0;
	   }
	   
	   if (rspeed < 0){
		   rightmotordirection = 0x1;
	   } else {
		   rightmotordirection = 0x0;
	   }
	   
	   let buf = pins.createBuffer(3);

            buf[0] = 0x00;
            buf[1] = leftmotordirection;
            buf[2] = Leftspeed;
            pins.i2cWriteBuffer(0x10, buf);

            buf[0] = 0x02;
            buf[1] = rightmotordirection;
            buf[2] = Rightspeed;
            pins.i2cWriteBuffer(0x10, buf);

    }
	
	//% weight=20
    //% blockId=motor_motorStop block="brake"
    export function allmotorStop(): void {
        let buf = pins.createBuffer(3);
 
            buf[0] = 0x00;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
            pins.i2cWriteBuffer(0x10, buf);

    }

    
}
