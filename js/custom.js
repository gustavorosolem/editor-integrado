var api_url = 'http://api.lojaintegrada.com.br/api/v1/';
var api_url_alternative = 'http://synergyconsulting.com.br/li-manager/v1/';
var api_chave_aplicacao = '7a7134e1-dfc3-4922-b145-eb8b605171aa';
var api_chave_api = (localStorage.getItem("chave_api") == 'teste' ? '20bfdd1a-51c4-4996-aedc-e53c132e1779' : localStorage.getItem("chave_api")); // Testes

var ListagemProdutos = React.createClass({
  getInitialState: function() {
    return {data: [], produtos: []};
  },
  loadProdutosFromAPI: function() {
    $.ajax({
      url: this.props.url + "produto?limit=20&offset=0",
      data: {
        chave_api: api_chave_api,
        chave_aplicacao: api_chave_aplicacao
      },
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
        this.loadProdutoIndividual();
        console.log(data)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        localStorage.removeItem("chave_api");
        alert('Chave API incorreta');
        window.location = 'index.html'
      }.bind(this)
    });
  },
  loadProdutoIndividual: function() {
    var loopTime = 0;
    var retorno = this.state.data.objects;
    var url = this.props.url;
    var $this = this;
    console.log(retorno)
    iterate();
    function iterate() {
      if(retorno[loopTime]) {
        if(retorno[loopTime].ativo === undefined ) {
          $.ajax({
            url: url + "produto/" + retorno[loopTime].id,
            data: {
              chave_api: api_chave_api,
              chave_aplicacao: api_chave_aplicacao
            },
            dataType: 'json',
            cache: false,
            success: function(data) {
              $this.setState({produtos: $this.state.produtos.concat([data])});
              loopTime++;
              if (loopTime < retorno.length) { iterate(); }
            }.bind($this),
            error: function(xhr, status, err) {
              console.error($this.props.url, status, err.toString());
            }.bind($this)
          });
        }
      }
    }
  },
  componentDidMount: function() {
    this.loadProdutosFromAPI();
  },
  render: function() {
    return (
      <ProdutoTR produtos={this.state.produtos} />
    );
  }
});
var ProdutoTR = React.createClass({
  render: function() {
    var $this = this
    // Handle case where the response is not here yet
    if (!this.props.produtos) {
     // Note that you can return false it you want nothing to be put in the dom
     // This is also your chance to render a spinner or something...
     return <tbody><tr><td>Carregando...</td></tr></tbody>;
    }
    // Gives you the opportunity to handle the case where the ajax request
    // completed but the result array is empty
    if (this.props.produtos.length === 0) {
      return <tbody><tr><td>Carregando...</td></tr></tbody>;
    }
    // Normal case
    console.log(this.props.produtos)
    var produtoNodes = this.props.produtos.map(function(index){
      return (
        <Produto data={index} key={index.id} />
      )
    });
    return (
      <tbody>
        {produtoNodes}
      </tbody>
    )
  }
});
var Produto = React.createClass({
  getInitialState: function() {
    return {
      ativo: this.props.data.ativo,
      destaque: this.props.data.destaque,
      data: this.props.data
    };
  },
  ajaxPUT: function(data) {
    console.log(data)
    data.categorias = this.state.data.categorias;
    data.chave_api = api_chave_api;
    data.chave_aplicacao = api_chave_aplicacao;
    $.ajax({
      url: api_url_alternative + "produto/" + this.state.data.id,
      dataType: 'json',
      type: 'PUT',
      data: data,
      success: function(data) {
        this.setState({data: data});
        console.log(data)
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({ativo: this.state.data.ativo});
        this.setState({destaque: this.state.data.destaque});
        console.error(this.props.url, status, err.toString());
        console.log(err)
      }.bind(this)
    });
  },
  alterarStatus: function(event) {
    this.setState({ativo: event.target.checked});
    this.ajaxPUT(
      {
        "ativo": event.target.checked
      }
    );
  },
  alterarDestaque: function(event) {
    this.setState({destaque: !this.state.data.destaque});
    this.ajaxPUT(
      {
        "destaque": !this.state.data.destaque
      }
    );
  },
  render: function() {
    var produto = this.state.data;
    return (
      <tr>
        <td>
          <div className="ckbox">
            <input type="checkbox" id={produto.id} checked={this.state.ativo} onChange={this.alterarStatus} />
            <label htmlFor={produto.id}></label>
          </div>
        </td>
        <td>
          <a href="javascript:;" onClick={this.alterarDestaque} className={this.state.destaque ? "star star-checked" : "star"}>
            <i className="glyphicon glyphicon-star"></i>
          </a>
        </td>
        <td>
          <div className="media">
            <a href="#" className="pull-left">
              <img src={produto.imagem_principal ? produto.imagem_principal.icone.replace('production/static/','') : 'https://s3.amazonaws.com/uifaces/faces/twitter/fffabs/128.jpg'} className="media-photo" />
            </a>
            <div className="media-body">
              <span className="media-meta pull-right">{moment(produto.data_modificacao).format("DD/MM/YYYY")}</span>
              <h4 className="title">
                {produto.nome}
                <span className="pull-right pagado">{produto.tipo == 'atributo' ? 'Variações' : ''}</span>
              </h4>
              <p className="summary">{produto.sku}</p>
            </div>
          </div>
        </td>
      </tr>
    );
  }
});

var Logout = React.createClass({
  logout: function(event) {
    localStorage.removeItem("chave_api");
    window.location = 'index.html'
  },
  render: function() {
    return (
      <a href="javascript:;" className="btn btn-default btn-filter" data-target="all" onClick={this.logout}>Logout</a>
    );
  }
});

ReactDOM.render(
  <ListagemProdutos url={api_url} />,
  document.getElementById('listagemProdutos')
);
ReactDOM.render(
  <Logout />,
  document.getElementById('logout')
);
