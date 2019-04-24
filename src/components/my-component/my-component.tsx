import { Component, Prop, Element } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  @Element() el!: HTMLStencilElement;
  arrColunas = [
    {
      nome: 'Nome',
      campo: 'nome',
      colBotaoExpandir: true
    },
    {
      nome: 'Telefone',
      campo: 'telefone',
      colBotaoExpandir: false
    }
  ];

  arrDados = [
    {
      nome: 'João',
      telefone: '(21)1234-4321',
      aberto: true,
      filhos: [
        {
          nome: 'Cleber',
          telefone: '(22)1234-5678',
          aberto: false,
          filhos: null
        },
        {
          nome: 'Gabriela',
          telefone: '(21)92572-4381',
          aberto: false,
          filhos: [
            {
              nome: 'Henrique',
              telefone: '(99)97814-5624',
              aberto: false,
              filhos: null
            }
          ]
        }
      ]
    },
    {
      nome: 'Maria',
      telefone: '(21)2233-3322',
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

  renderCol(dados, col, nivel){
    let classesTD = 'nivel-' + nivel + ' ' + col.campo;

    if (col.colBotaoExpandir){
      classesTD += ' col-margin-nivel';
    }
    
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
                return <th>{col.nome}</th>
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