import React from 'react';
import  './modal.css';
import { FiX } from 'react-icons/fi';

const Modal = ({conteudo, close}) => {

    const chooseColor = (colorName) => {
        const color = {
          Aberto: '#5cb85c',
          Atendido: '#999',
          Progresso: '#4a28e4'
        };
  
        return color[colorName];
      }

  return (
    <div className="modal">
        <div className="container">
            <button className="close" onClick={ () => close() }>
            <FiX size={23} color="#FFF" />
                Voltar
            </button>

            <div>
                <h2>Detalhes do chamado</h2>

                <div className="row">
                    <span>
                        Cliente: <i>{conteudo.cliente}</i>
                    </span>
                </div>

                <div className="row">
                    <span>
                        Assunto: <i>{conteudo.assunto}</i>
                    </span> <br /> <br />
                    <span>
                        Cadastrado em: <i>{conteudo.createdFormated}</i>
                    </span>
                </div>

                <div className="row">
                    <span>
                        Status: <i style={{ color: '#FFF', backgroundColor: chooseColor(conteudo.status) }}>{conteudo.status}</i>
                    </span>
                </div>

                {conteudo.complemento !== '' && (
                    <>
                    <h3>Complemento</h3>
                    <p>
                      {conteudo.complemento}
                    </p>
                  </>
                ) }
            </div>
        </div>
    </div>
  );
}

export default Modal;