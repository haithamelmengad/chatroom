var React = require('react');
var ReactDOM = require('react-dom');

var ChatRoom = React.createClass({
  getInitialState: function() {
    return {
      socket: this.props.socket,
      message: "",
      messages: []
    }
  },
  receiveMessage: function(msg) {
    this.setState ({
      messages: this.state.messages.concat([msg])
    });
  },
  updateMessage: function(e) {
    this.setState ({
      message: e.target.value
    })
  },

  serviceworker: function () {
    this.setState({
      messages: this.state.messages.concat([
        {
          username: "Alfred",
          content: "BlackSMS"
        }
      ])
    })
  },

  componentDidMount: function() {
    this.state.socket.on('message', this.receiveMessage);
    setInterval(this.serviceworker , 60000)
  },
  sendMessage: function(e) {

    e.preventDefault();
    if(this.state.message.length !== 0 && this.props.username.length !== 0){
      this.state.socket.emit('message', this.state.message);
      this.setState({
        message: '',
        messages: this.state.messages.concat([{username: this.props.username, content: this.state.message}])
      })
    } 
    if (this.state.message.length === 0) {
      alert("You cannot send an empty message");

    }
    if (this.props.username.length === 0) {
      alert("Who are you ? You need a username to chat");

    }
  
  },
  render: function() {
    var temp = [];

    for (var i = 0; i < this.state.messages.length; i++) {
      temp.push(<li key={i} >{this.state.messages[i].username}: {this.state.messages[i].content} </li>);
    }
    return (
      <div>
        <h4>Messages</h4>
        <div><ul>{temp}</ul></div>
        <form onSubmit={this.sendMessage}>
        <input className="form-control" type="text" onChange={this.updateMessage} value={this.state.message}/>
        <button type="submit" className="btn btn-default" >Send Message</button>
        </form>
      </div>
    )
      
  }
})

var App = React.createClass({
  getInitialState: function() {
    return {
      socket: io()
    }   
  },
  componentDidMount: function() {

    this.state.socket.on('connect', function() {
      var username = prompt("Enter a username");
      this.setState ({
        username: username
      })
      this.state.socket.emit('username', username);
    }.bind(this));

   
    this.state.socket.on('errorMessage', function(message) {
      alert('errorMessage ' + message);
    }.bind(this));

  },

  render: function() {
    return (
      <div>
        <h1>Black SMS</h1>
        <br> </br>
        <br> </br>
        <br> </br>
        <ChatRoom username={this.state.username} socket={this.state.socket} ></ChatRoom>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
