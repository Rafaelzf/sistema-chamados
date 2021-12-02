import React, { useContext, useState } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import { db } from '../../services/firebaseConnection';
import { doc, updateDoc, } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { toast } from 'react-toastify';
const Profile = () => {
  const { user, logout, setUser, storageUser, setLoading } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const [email] = useState(user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);
 


  function handleFile(e){
    if(e.target.files[0]){
        const image = e.target.files[0];
        
        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            setImageAvatar(image);
            const UrlImage = URL.createObjectURL(image);
            setAvatarUrl(UrlImage);
        }else {
          toast.error('Envie uma imagem do tipo PNG ou JPEG');
          setImageAvatar(null);
          return null;
        }
    }
  }

  async function handleUpload(){
    const currentUid = user.uid;

    const metadata = {
      contentType: imageAvatar.type
    };

    const storage = getStorage();
    const storageRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageAvatar, metadata);

    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      setLoading(true);

      const docRef = doc(db, 'users', currentUid);

       await updateDoc(docRef, {
            nome: nome,
            avatarUrl: downloadURL,
          }).then(() => {
            const data = {
              ...user,
              nome: nome,
            avatarUrl: downloadURL,
            };
            setUser(data);
            storageUser(data);
            toast.success('Imagem atualizada com sucesso!');
          }).catch((error) => {
            toast.error('Erro ao atualizar a imagem!');
            console.error(error);
          })
      

    }).catch((error) => {
      toast.error('Erro ao realizar o upload a imagem!');
      console.error(error);
    }).finally(() => setLoading(false));
  }

  async function handleSave(e) {
    e.preventDefault();

    if(imageAvatar === null && nome !== ''){
          setLoading(true);
          const docRef = doc(db, 'users', user.uid);

          await  updateDoc(docRef, {
            nome: nome
          }).then(() => {
            const data = {
              ...user,
              nome: nome
            };
            setUser(data);
            storageUser(data);
            toast.success('Usuário atualizado');
          }).catch((error) => {
            toast.error('Erro ao Atualizar o nome do usuário!');
            console.error(error);
        }).finally(() => setLoading(false));
        
    } else if(nome !== '' && imageAvatar !== null){
      handleUpload();
    }
  };



  return (
      <div>
          <Header />

          <div className="content">
              <Title name="Meu perfil">
                <FiSettings size={25} />
              </Title>

              <div className="container">
                <form className="form-profile" onSubmit={handleSave}>
                    <label className="label-avatar">
                        <span>
                          <FiUpload color="#FFF" size={25} />
                        </span>
                        <div>
                          <input type="file" accept="image/*" onChange={handleFile} />
                        </div>

                        {avatarUrl === null ?  
                        <img src={avatar} width="250" height="250" alt="Foto de perfil do usuario" />
                        : 
                        <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
                      }
                    </label>

                    <label>Nome </label>
                    <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) } />

                    <label>Email</label>
                    <input type="text" value={email} disabled={true} />

                    <button type="submit">Salvar</button>       
                </form>
              </div>

              <div className="container">
                <button className="logout-btn" onClick={ () => logout() } >
                   Sair
                </button>
              </div>
          </div>
      </div>
  );
}

export default Profile;