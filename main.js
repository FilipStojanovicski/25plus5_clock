var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

function TimerSelect(props) {
    return React.createElement(
        "div",
        { className: "timer-select", id: props.type + "-timer" },
        React.createElement(
            "div",
            { id: props.type + "-label" },
            props.type.slice(0, 1).toUpperCase() + props.type.slice(1) + " Length"
        ),
        React.createElement(
            "div",
            { className: "timer-select-contents" },
            React.createElement(
                "button",
                { id: props.type + "-increment", onClick: props.handleTimeControl },
                React.createElement("i", { className: "fa fa-arrow-up fa-2x" })
            ),
            React.createElement(
                "div",
                { id: props.type + "-length" },
                props.length
            ),
            React.createElement(
                "button",
                { id: props.type + "-decrement", onClick: props.handleTimeControl },
                React.createElement("i", { className: "fa fa-arrow-down fa-2x" })
            )
        )
    );
}

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            breakLength: 5,
            sessionLength: 25,
            timer: 1500,
            intervalID: "",
            running: false,
            type: "Session",
            alarmColor: { color: 'black' }
        };
        _this.handleTimeControl = _this.handleTimeControl.bind(_this);
        _this.clockify = _this.clockify.bind(_this);
        _this.handleReset = _this.handleReset.bind(_this);
        _this.handleStartStop = _this.handleStartStop.bind(_this);
        _this.decrementTimer = _this.decrementTimer.bind(_this);
        _this.playBeep = _this.playBeep.bind(_this);
        _this.stopBeep = _this.stopBeep.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: "handleStartStop",
        value: function handleStartStop() {
            if (this.state.running) {
                clearInterval(this.state.intervalID);
                this.setState({ running: false });
            } else if (!this.state.running) {
                var intervalID = setInterval(this.decrementTimer, 1000);
                this.setState({ intervalID: intervalID, running: true });
            }
        }
    }, {
        key: "decrementTimer",
        value: function decrementTimer() {
            // If the timer is not less than zero decrement by one second
            if (this.state.timer - 1 > 60) {
                this.setState({ timer: this.state.timer - 1, alarmColor: { color: 'black' } });
            }
            // If the timer is less than 60 change the color to red
            if (this.state.timer - 1 > 0 && this.state.timer - 1 < 60) {
                this.setState({ timer: this.state.timer - 1, alarmColor: { color: '#a50d0d' } });
            }
            // If the timer is at 0 play the beep
            else if (this.state.timer - 1 == 0) {
                    this.playBeep();
                    this.setState({ timer: this.state.timer - 1 });
                }
                // If the timer is less than zero
                else if (this.state.timer - 1 < 0) {
                        // If we are in a session then we start the break timer
                        if (this.state.type == "Session") {
                            this.setState({ timer: this.state.breakLength * 60, type: "Break" });
                        }
                        // If we are in a break then we start the session timer
                        else if (this.state.type == "Break") {
                                this.setState({ timer: this.state.sessionLength * 60, type: "Session" });
                            }
                    }
        }
    }, {
        key: "handleTimeControl",
        value: function handleTimeControl(e) {
            // Get the type: break or session
            var type = e.currentTarget.id.split('-')[0];
            var stateToChange = type + "Length";
            // Get the action: increment or decrement
            var action = e.currentTarget.id.split('-')[1];

            // Only adjust the session and break length if not running
            if (!this.state.running) {
                // If we are incrementing, only add time if it is not over 60
                if (action == "increment" && this.state[stateToChange] + 1 <= 60) {
                    var _setState;

                    this.setState((_setState = {}, _defineProperty(_setState, stateToChange, this.state[stateToChange] + 1), _defineProperty(_setState, "timer", type == "session" ? (this.state.sessionLength + 1) * 60 : this.state.sessionLength * 60), _setState));
                    // If we are decrementing, only remove time if it is not less than 0
                } else if (action == "decrement" && this.state[stateToChange] - 1 > 0) {
                    var _setState2;

                    this.setState((_setState2 = {}, _defineProperty(_setState2, stateToChange, this.state[stateToChange] - 1), _defineProperty(_setState2, "timer", type == "session" ? (this.state.sessionLength - 1) * 60 : this.state.sessionLength * 60), _setState2));
                }
            }
        }
    }, {
        key: "handleReset",
        value: function handleReset() {
            if (this.state.intervalID != "") {
                clearInterval(this.state.intervalID);
            }
            this.stopBeep();
            this.setState({
                breakLength: 5,
                sessionLength: 25,
                timer: 1500,
                intervalID: "",
                running: false,
                type: "Session",
                alarmColor: { color: 'black' }

            });
        }
    }, {
        key: "clockify",
        value: function clockify() {
            var minutes = Math.floor(this.state.timer / 60);
            var seconds = this.state.timer - minutes * 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return minutes + ':' + seconds;
        }
    }, {
        key: "playBeep",
        value: function playBeep() {
            var beepAudio = document.getElementById("beep");
            beepAudio.play();
        }
    }, {
        key: "stopBeep",
        value: function stopBeep() {
            var beepAudio = document.getElementById("beep");
            beepAudio.pause();
            beepAudio.currentTime = 0;
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            console.log(this.state);

            var time_types = ["break", "session"];

            return React.createElement(
                "div",
                { id: "clock" },
                React.createElement(
                    "div",
                    { className: "main-title" },
                    "25 + 5 Clock"
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "clock-contents" },
                        time_types.map(function (x) {
                            return React.createElement(TimerSelect, { key: x, type: x, length: _this2.state[x + "Length"], handleTimeControl: _this2.handleTimeControl });
                        })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "timer-display", style: this.state.alarmColor },
                    React.createElement(
                        "div",
                        { className: "timer-display-wrapper" },
                        React.createElement(
                            "div",
                            { id: "timer-label" },
                            this.state.type
                        ),
                        React.createElement(
                            "div",
                            { id: "time-left" },
                            this.clockify()
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "timer-controls" },
                    React.createElement(
                        "div",
                        { className: "timer-controls-btn", id: "start_stop", onClick: this.handleStartStop },
                        React.createElement("i", { className: "fa fa-play fa-x" }),
                        React.createElement("i", { className: "fa fa-pause fa-x" })
                    ),
                    React.createElement(
                        "div",
                        { className: "timer-controls-btn", id: "reset", onClick: this.handleReset },
                        React.createElement("i", { className: "fa fa-refresh fa-x" })
                    )
                ),
                React.createElement("audio", { id: "beep",
                    src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                })
            );
        }
    }]);

    return App;
}(React.Component);

var domContainer = document.querySelector('#root');
var clock = ReactDOM.render(React.createElement(App, null), domContainer);
