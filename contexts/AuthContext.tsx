import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import { auth, db } from '@/services/firebase';

// O tipo de dados que salvamos no Firestore lá na tela de Cadastro
export type UserProfile = {
  nome: string;
  username: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  createdAt: string;
};

type AuthContextData = {
  user: User | null; // Dados básicos de autenticação do Google (UID, email)
  userProfile: UserProfile | null; // Nossos dados complementares do Firestore (Nome, CPF...)
  loadingAuth: boolean; // Para mostrarmos uma tela de loading enquanto o app descobre se alguém está logado
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Esse "olheiro" do Firebase roda toda vez que o app abre ou o usuário loga/desloga
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Se achou alguém logado, salva o usuário básico
        setUser(firebaseUser);
        
        // Vai lá no banco de dados e busca o perfil completo da pessoa (nome, telefone, etc)
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          }
        } catch (error) {
          console.error('Erro ao buscar perfil do usuário:', error);
        }
      } else {
        // Ninguém logado (ou acabou de deslogar)
        setUser(null);
        setUserProfile(null);
      }
      
      // Terminou de verificar, tira o app do estado de carregamento inicial
      setLoadingAuth(false);
    });

    return unsubscribe;
  }, []);

  // Função centralizada para fazer login
  const login = async (email: string, senha: string) => {
    await signInWithEmailAndPassword(auth, email, senha);
  };

  // Função centralizada para deslogar
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loadingAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }

  return context;
}