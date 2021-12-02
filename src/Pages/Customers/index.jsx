import { useState, useContext } from 'react';
import './customers.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import { FiUser } from 'react-icons/fi';
import { db } from '../../services/firebaseConnection';
import {  addDoc, collection } from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

const Customers = () => {
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const { setLoading } = useContext(AuthContext);

    async function handleAdd(e){
        e.preventDefault();
        if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
            setLoading(true);
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            }).then(() => {
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.info('Empresa cadastrada com sucesso!');
            }).catch((error) => {
                toast.error('Ocorreu algum erro ao cadastrar a empresa!');
                console.error(error);
            }).finally(() => setLoading(false));
        }
    }
    
  return (
    <div>
      <Header/>

      <div className="content">
        <Title name="Clientes">
            <FiUser size={25} />
        </Title>

        <div className="container">
            <form className="form-profile customers" onSubmit={handleAdd}>
                <label>Nome fantasia</label>
                <input type="text" placeholder="Nome da sua empresa" value={nomeFantasia} onChange={ (e) => setNomeFantasia(e.target.value) } />

                <label>CNPJ</label>
                <input type="text" placeholder="Seu CNPJ" value={cnpj} onChange={ (e) => setCnpj(e.target.value) } />

                <label>Endereço</label>
                <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={ (e) => setEndereco(e.target.value) } />

                <button type="submit">Cadastrar</button>

            </form>
        </div>
      </div>

  </div>);
}

export default Customers;