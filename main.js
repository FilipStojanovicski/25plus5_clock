const e = React.createElement;

function TimerSelect(props) {
    return (
    <div className="timer-select" id={props.type+"-timer"}>
        <div id={props.type+"-label"}>{props.type.slice(0,1).toUpperCase() + props.type.slice(1) + " Length"}</div>
        <div className="timer-select-contents">
            <button id={props.type+"-increment"} onClick={props.handleTimeControl}>
            <i className="fa fa-arrow-up fa-2x" /></button>
            <div id={props.type+"-length"}>{props.length}</div>
            <button id={props.type+"-decrement"} onClick={props.handleTimeControl}>
            <i className="fa fa-arrow-down fa-2x" />
            </button>
        </div>
    </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breakLength: 5,
            sessionLength: 25,
            timer: 1500,
            intervalID: "",
            running: false,
            type: "Session",
            alarmColor: { color: 'black' }
        };
        this.handleTimeControl = this.handleTimeControl.bind(this);
        this.clockify = this.clockify.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleStartStop = this.handleStartStop.bind(this);
        this.decrementTimer = this.decrementTimer.bind(this);
        this.playBeep = this.playBeep.bind(this);
        this.stopBeep = this.stopBeep.bind(this);
    }

    handleStartStop(){
        if (this.state.running){
            clearInterval(this.state.intervalID);
            this.setState({running: false});
        }
        else if(!this.state.running){
            var intervalID = setInterval(this.decrementTimer, 1000);
            this.setState({intervalID: intervalID, running: true});
        }
        
    }

    decrementTimer(){
        // If the timer is not less than zero decrement by one second
        if (this.state.timer - 1 > 60){
            this.setState({ timer: this.state.timer - 1, alarmColor: { color: 'black' }});
        }
        // If the timer is less than 60 change the color to red
        if(this.state.timer - 1 > 0 && this.state.timer - 1 < 60){
            this.setState({ timer: this.state.timer - 1, alarmColor: { color: '#a50d0d' }});
        }
        // If the timer is at 0 play the beep
        else if (this.state.timer - 1 == 0){
            this.playBeep();
            this.setState({ timer: this.state.timer - 1 });
        }
        // If the timer is less than zero
        else if (this.state.timer -  1  < 0){
            // If we are in a session then we start the break timer
            if (this.state.type == "Session"){
                this.setState({ timer: this.state.breakLength * 60, type: "Break"});
            }
            // If we are in a break then we start the session timer
            else if (this.state.type == "Break"){
                this.setState({ timer: this.state.sessionLength * 60, type: "Session"});
            }
        }

     }

    handleTimeControl(e){
        // Get the type: break or session
        let type = e.currentTarget.id.split('-')[0];
        let stateToChange = type+"Length";
        // Get the action: increment or decrement
        let action = e.currentTarget.id.split('-')[1]; 

        // Only adjust the session and break length if not running
        if (!this.state.running){
            // If we are incrementing, only add time if it is not over 60
            if (action == "increment" && this.state[stateToChange] + 1 <= 60){
                    this.setState({
                        [stateToChange]: this.state[stateToChange] + 1,
                        // Only If we are changing the session length, modify the timer
                        timer: type == "session" ? (this.state.sessionLength + 1) * 60 : this.state.sessionLength * 60
                    })
            // If we are decrementing, only remove time if it is not less than 0
            } else if (action == "decrement" && this.state[stateToChange] - 1 > 0){
                    this.setState({
                        [stateToChange]: this.state[stateToChange] - 1,
                        // Only If we are changing the session length, modify the timer
                        timer: type == "session" ? (this.state.sessionLength - 1) * 60 : this.state.sessionLength * 60
                    })
                }
            }
    }

    handleReset(){
        if (this.state.intervalID != ""){
            clearInterval(this.state.intervalID);
        }
        this.stopBeep()
        this.setState(
            {
                breakLength: 5,
                sessionLength: 25,
                timer: 1500,
                intervalID: "",
                running: false,
                type: "Session",
                alarmColor: { color: 'black' }

            }
        )
    }

    clockify() {
        let minutes = Math.floor(this.state.timer / 60);
        let seconds = this.state.timer - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return minutes + ':' + seconds;
      }

    playBeep(){
        let beepAudio = document.getElementById("beep");
        beepAudio.play();
    }
    stopBeep(){
        let beepAudio = document.getElementById("beep");
        beepAudio.pause();
        beepAudio.currentTime = 0;
    }

    render() {
        console.log(this.state);

        let time_types = ["break", "session"];    

        return (
            <div id="clock">
                <div className="main-title">25 + 5 Clock</div>
                <div>
                    <div className="clock-contents">
                        {time_types.map((x) => {
                            return <TimerSelect key={x} type={x} length={this.state[x + "Length"]} handleTimeControl={this.handleTimeControl}/>
                        })}
                    </div>
                </div>
                <div className="timer-display" style={this.state.alarmColor}>
                    <div className="timer-display-wrapper">
                        <div id="timer-label">{this.state.type}</div>
                        <div id="time-left">{this.clockify()}</div>
                    </div>
                </div>
                <div className="timer-controls">
                    <div className="timer-controls-btn" id="start_stop" onClick={this.handleStartStop}>
                        <i className="fa fa-play fa-x" />
                        <i className="fa fa-pause fa-x" />
                    </div>
                    <div className="timer-controls-btn" id="reset" onClick={this.handleReset}>
                    <i className="fa fa-refresh fa-x" />
                    </div>
                </div>
                <audio id="beep" 
                src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </div>
        );
    }
}


let domContainer = document.querySelector('#root');
let clock = ReactDOM.render(<App />, domContainer);