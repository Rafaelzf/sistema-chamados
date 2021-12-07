import React, {useState, useEffect, useContext, useCallback} from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { useNavigate, useParams  } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { FiPlusCircle } from 'react-icons/fi';
import { db } from '../../services/firebaseConnection';
import { doc, getDocs, getDoc, addDoc, collection, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import './new.css';


const New = () => {
  const { user: { uid } } = useContext(AuthContext);
  const navigate  = useNavigate();
  let { id } = useParams();
  const [loadInserChamados, setloadInserChamados] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const [idCustomer, setIdCustomer] = useState(false);



  async function handleRegister(e){
    e.preventDefault();
    setloadInserChamados(true);

    if(idCustomer){

      await setDoc(doc(db, "chamados", id), {
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto,
        status,
        complemento,
        userUid: uid
      }).then(() => {
        toast.success('Chamado editado com sucesso!');
        setCustomerSelected(0);
        setComplemento('');
        navigate('/dashboard');
      }).catch((error) => {
        toast.error('Ocorreu algum erro ao editar um chamado!');
        console.error(error);
      }).finally(() => setloadInserChamados(false));

    } else {
      await addDoc(collection(db, "chamados"), {
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto,
        status,
        complemento,
        userUid: uid
      }).then(() => {
        toast.success('Chamado registrado com sucesso!');
        navigate('/dashboard');
      }).catch((error) => {
        toast.error('Ocorreu algum erro ao registrar um chamado!');
        console.error(error);
      }).finally(() => setloadInserChamados(false));
    }
  };

   //Chamado quando troca o assunto
   function handleChangeSelect(e){
    setAssunto(e.target.value);
  };

   //Chamado quando troca o status
   function handleOptionChange(e){
    setStatus(e.target.value);
  };

    //Chamado quando troca de cliente
    function handleChangeCustomers(e){
      setCustomerSelected(e.target.value);
    };


    //Chamado com ID no paramêtro URL
    const loadId = useCallback(async (lista) => {
      const docRef = doc(db, 'chamados', id);
      const docSnap = await getDoc(docRef);


      if(docSnap.exists()) {
        await getDoc(docRef).then((snapshot) => {
          setAssunto(snapshot.data().assunto);
          setStatus(snapshot.data().status);
          setComplemento(snapshot.data().complemento);

          let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
          setCustomerSelected(index);
          setIdCustomer(true);

        }).catch(() => {
          toast.error('Ocorreu algum erro ao ler dados do chamado!')
          setIdCustomer(false);
        });
      } else {
        toast.error('Chamado não existente.');
      }
    }, [id])

      


  useEffect(() => {

    async function loadCustomers() { 

      await getDocs(collection(db, "customers")).then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
        
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          });

          if(lista.length === 0){
            toast.warning('NENHUMA EMPRESA ENCONTRADA!');
            setCustomers([ { id: '1', nomeFantasia: 'FREELA' } ]);
            return;
          };
          setCustomers(lista);

          if(id) {
            loadId(lista);
          }

        });
      }).catch((error) => {
        toast.error('Ocorreu algum erro ao ler dados das empresas!');
        console.error(error);
      }).finally(() => setLoadCustomers(false));

    };
    loadCustomers();
  }, [id, loadId]);


  
  return (
      <div>
          <Header/>
          <div className="content">

          <Title name="Novo chamado">
            <FiPlusCircle size={25} />
          </Title>

          <div className="container">
            <form className="form-profile"  onSubmit={handleRegister} >
              <label>Cliente </label>

              {loadCustomers ? (
                 <input type="text" disabled={true} value="Carregando clientes..." />
              ) : (
                  <select value={customerSelected} onChange={handleChangeCustomers}>
                    {customers.map((customer, index) => {
                      return (
                        <option key={customer.id} value={index}>
                        {customer.nomeFantasia}
                        </option>
                      )
                    })}
                  </select>
              )}
          

              <label>Assunto</label>
              <select value={assunto} onChange={handleChangeSelect}>
                <option value="Suporte">Suporte</option>
                <option value="Visita Tecnica">Visita Tecnica</option>
                <option value="Financeiro">Financeiro</option>
              </select>

              <label>Status</label>
              <div className="status">
                <input  type="radio" name="radio" value="Aberto"  checked={ status === 'Aberto' }  onChange={handleOptionChange} />
                <span>Em Aberto</span>

                <input  type="radio" name="radio" value="Progresso" checked={ status === 'Progresso' }  onChange={handleOptionChange} />
                <span>Progresso</span>

                <input  type="radio" name="radio" value="Atendido" checked={ status === 'Atendido' }  onChange={handleOptionChange} />
                <span>Atendido</span>
              </div>

              <label>Complemento</label>
              <textarea type="text" 
              placeholder="Descreva seu problema (opcional)." 
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
               />

              {loadInserChamados ? <button className="disableButton" type="submit" disabled={true}>Enviando ...</button> : <button type="submit">
                {idCustomer ? 'Editar' : 'Registrar'}
              </button>}
            </form>
          </div>

          </div>
      </div>
  );
}

export default New;