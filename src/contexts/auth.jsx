import { useState, createContext, useMemo} from 'react';
import { db, auth } from '../services/firebaseConnection';
import { doc, setDoc, getDoc  } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";

import { toast } from 'react-toastify';


export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);


    const memoizedUser = useMemo(() => {
        if(!user){
            const storeUser = localStorage.getItem('sistema');
            const userParsed = JSON.parse(storeUser);
            setUser(userParsed);
            setLoading(false);
            return userParsed;
        }
        setLoading(false);
        return user;
    }, [user]);

    
    // cadastrar novo user
    async function signUp(email, password, nome){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password).then( async (userCredential) => {
            let uid = userCredential.user.uid;

            await setDoc(doc(db, 'users', uid), {
                nome,
                avatarUrl: null
            }).then(() => {
                let data = {
                    uid,
                    nome,
                    email: userCredential.user.email,
                    avatarUrl: null
                };
                setUser(data);
                storageUser(data);
                toast.success('Bem-vindo a plataforma!');
            }).catch((error) => {
                toast.error('Ocorreu algum erro ao cadastrar o usuário!');
                console.error(error);
            }).finally(() => setLoadingAuth(false))
        });
    };

    
    // Deslogar user
     function logout(){
        signOut(auth).then(() => {
            toast.success('Usuário deslogado com sucesso!');
            localStorage.removeItem('sistema');
            setUser(null);
        }).catch((error) => {
            toast.error('Erro ao deslogar o usuário!');
            console.error(error);
        })
    };

    // Logar user
    async function signIn(email, password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {

        const {user: { uid }} = userCredential;

        getDoc(doc(db, "users", uid)).then((userInfo) => {
            const userInfoData = userInfo.data();

            const data = {
                uid,
                nome: userInfoData.nome,
                email,
                avatarUrl: userInfoData.avatarUrl
            };

            setUser(data);
            storageUser(data);
            toast.success('Bem-vindo a plataforma!');
        }).catch((err) => {
            toast.error('Ocorreu algum erro ao acessar dados do usuário!');
            console.error(err);
        });

        }).catch((error) => {
            toast.error('Ocorreu algum erro ao Logar o usuário!');
            console.error(error);
        }).finally(() => setLoadingAuth(false));
    }

    function storageUser(data){
        const userStringify = JSON.stringify(data);
        localStorage.setItem('sistema', userStringify);
    }

    return (
        <AuthContext.Provider value={{ 
            signed: !!memoizedUser, 
            user, 
            loading,
            setLoading,
            signUp, 
            logout, 
            signIn, 
            loadingAuth, 
            setUser, 
            storageUser}}>

            {children}

        </AuthContext.Provider>
    )
};

export default AuthProvider;