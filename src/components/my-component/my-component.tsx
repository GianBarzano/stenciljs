import { Component, Prop, Element } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss'
})
export class MyComponent {
  @Element() el!: HTMLStencilElement;
  arrColunas = [
    {
      nome: 'Pacote/Oferta/Produto',
      campo: 'nome',
      colBotaoExpandir: true,
      marginNivel: true,
      tipo: 'valor'
    },
    {
      nome: 'Tipo',
      campo: 'tipo',
      colBotaoExpandir: false,
      tipo: 'valor'
    },
    {
      nome: 'Quantidade',
      campo: 'qtd',
      colBotaoExpandir: false,
      tipo: 'valor'
    },
    {
      nome: 'Unidade',
      campo: 'un',
      colBotaoExpandir: false,
      tipo: 'valor'
    },
    {
      nome: 'Valor',
      campo: 'valor',
      colBotaoExpandir: false,
      marginNivel: true,
      tipo: 'valor'
    },
    {
      nome: 'Opções',
      campo: null,
      colBotaoExpandir: false,
      tipo: 'botoes',
      botoes: [
        {
          valor: 'Adicionar',
          iconeFa: 'fa-add',
          classe: 'btn-add',
          //Nível 0 é o título
          niveis: [
            0, 1, 2
          ],
          fOnClick: {
            params: {
              url: 'www.teste.com.br'
            },
            funcao: (params: any) => {
              console.log(params);
            }
          }

        }
      ]
    }
  ];

  arrDados = [
    {
      nome: 'Velório Itaú 3000',
      tipo: 'Pacote',
      qtd: null,
      un: null,
      valor: 4600,
      aberto: false,
      filhos: [
        {
          nome: 'Velório',
          tipo: 'Oferta',
          qtd: 4,
          un: 'hh',
          valor: 3000,
          aberto: false,
          filhos: [
            {
              nome: 'Ornamentação',
              tipo: 'Componente',
              qtd: 1,
              un: 'hh',
              valor: 1500,
              aberto: false,
              filhos: null
            },
            {
              nome: 'Acompanhamento',
              tipo: 'Componente',
              qtd: 4,
              un: 'hh',
              valor: 500,
              aberto: false,
              filhos: null
            },{
              nome: 'Ornamentação',
              tipo: 'Produto',
              qtd: 1,
              un: 'hh',
              valor: 1000,
              aberto: false,
              filhos: null
            }
          ]
        },
        {
          nome: 'Cortejo',
          tipo: 'Oferta',
          qtd: 1,
          un: 'hh',
          valor: 600,
          aberto: false,
          filhos: null
        },
        {
          nome: 'Sepultamento',
          tipo: 'Oferta',
          qtd: 1,
          un: 'hh',
          valor: 1600,
          aberto: false,
          filhos: null
        }
      ]
    },
    {
      nome: 'Velório FMA 002',
      tipo: 'Pacote',
      qtd: null,
      un: null,
      valor: 4600,
      aberto: false,
      filhos: null
    },
  ];

  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  /**
   * Renderiza a lista de dados da tabela
   * @param filhos 
   * @param nivel 
   */
  renderRows(filhos: any[], nivel: number){
    let filhosJSX = [];
      filhos.forEach(filho => {
        let filhoJSX = this.renderRow(filho, nivel);
        filhosJSX.push(filhoJSX);
      })

      return (filhosJSX)
  }

  /**
   * Renderiza a linha da tabela.
   * @param dados 
   * @param nivel 
   */
  renderRow(dados: any, nivel: number){
    //Caso o dado não possua subniveis, ou não esteja aberto, só renderizo a linha
    if (dados.filhos == null || dados.aberto == false){
      return <tr>
        {this.arrColunas.map(col => {
          return this.renderCol(dados, col, nivel)
        })}
      </tr>
    }else{
      //Renderizo a linha e seus subníveis.
      return ([
        <tr>
          {this.arrColunas.map(col => {
            return this.renderCol(dados, col, nivel)
          })}
        </tr>, this.renderRows(dados.filhos, ++nivel)
      ])
    }
  }

  /**
   * Renderiza a coluna do título
   * @param dados 
   * @param col 
   * @param nivel 
   */
  renderColTitulo(dados, col){
    let nivel = 0;
    let classesTD = 'nivel-' + nivel + ' ' + col.campo;

    if (col.tipo == 'valor'){
      return <th class={classesTD}>{col.nome}</th>
    }
    else if (col.tipo == 'botoes'){
      return this.renderColBotoes(dados, col, nivel)
    }
  }

  renderCol(dados, col, nivel){
    let classesTD = 'nivel-' + nivel + ' ' + col.campo;

    if (col.colBotaoExpandir){
      classesTD += ' col-margin-nivel';
    }
    
    if (col.tipo == 'valor'){
      if (col.colBotaoExpandir == true && dados.filhos != null){
        return <td class={classesTD}>
          <label onClick={() => this.controlaExpansao(dados, !dados.aberto)} class="btn-expandir">
            {dados.aberto ? ' - ': ' + '}
          </label>
          {dados[col.campo]}
        </td>
      }
      else{
        return <td class={classesTD}>
          {dados[col.campo]}
        </td>
      }
    }
    else if (col.tipo == 'botoes'){
      return this.renderColBotoes(dados, col, nivel)
    }
  }

  /**
   * Renderiza a coluna do tipo "botões"
   * @param dados 
   * @param col 
   * @param nivel 
   */
  renderColBotoes(dados, col, nivel){
    let classesTD = 'nivel-' + nivel + ' ' + col.campo;

    return <td class={classesTD}>
      {col.botoes.map(botao => {
        //Verifico se o botão está configurado para o nível atual
        if (botao.niveis.find((n) => {return (n == nivel)}) != undefined){
          let params = {
            dadosFixos: botao.fOnClick.params,
            dadosColuna: {
              item: dados,
              nivel: nivel
            }
          }
  
          return <button class={botao.classe} onClick={() => botao.fOnClick.funcao(params)}>{botao.valor}</button>
        }
      })}
    </td>
  }

  /**
   * Expande/Fechar elementos filhos do item passado
   * @param dados 
   * @param abrir 
   */
  controlaExpansao(dados: any, abrir: boolean){
    dados.aberto = abrir;
    this.el.forceUpdate();
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              {this.arrColunas.map((col) => {
                return this.renderColTitulo(this.arrDados, col)
                
              })}
            </tr>
          </thead>
          <tbody>
            {this.renderRows(this.arrDados, 1)}
          </tbody>
        </table>
      </div>
    );
  }
}