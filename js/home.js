var Login = React.createClass({
  getInitialState: function() {
    return {chave_api: localStorage.getItem("chave_api")};
  },
  componentDidMount: function() {
    if(this.state.chave_api) {
      window.location = 'listagem.html'
    }
  },
  handleChaveChange: function(e) {
    this.setState({chave_api: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var chave_api = this.state.chave_api.trim();
    console.log(chave_api)
    if (!chave_api) {
      return;
    }
    localStorage.setItem("chave_api", chave_api);
    window.location = 'listagem.html'
  },
  render: function() {
    return (
      <form className="form-signin" onSubmit={this.handleSubmit}>
        <h1 className="form-signin-heading text-muted">Acessar</h1>
        <input type="text" className="form-control" placeholder="Chave API" required="required" onChange={this.handleChaveChange} />
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Login
        </button>
      </form>
    );
  }
});

ReactDOM.render(
  <Login />,
  document.getElementById('login-container')
);
