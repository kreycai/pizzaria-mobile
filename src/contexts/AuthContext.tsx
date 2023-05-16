import React, {useState, createContext, ReactNode, useEffect} from "react";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import  io , {Socket}  from "socket.io-client";

type AuthContextData = {
    user: UserProps
    isAuthenticated: boolean
    signIn: (credentials: SignInProps) => Promise<void>
    loading: boolean
    loadingAuth: boolean
    signOut: () => Promise<void>
    socket: Socket | null;
    isConnected: boolean
}

type UserProps = {
    id: string
    name: string
    email: string
    token: string
}

type AuthProviderProps = {
    children: ReactNode
}

type SignInProps = {
    email: string
    password: string
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<UserProps>({
        id:'',
        name: '',
        email: '',
        token: ''
    });
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true)
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null)

    const isAuthenticated = !!user.name // converte pra true ou falso

    useEffect(()=>{
        const socket = io('http://192.168.1.100:3333');
        setSocket(socket)
        if(socket){
            setIsConnected(true)
        }
        async function getUser(){
            //pegar dados salvos no user
            const userInfo = await AsyncStorage.getItem('@pizzaria');
            let hasUser:UserProps = JSON.parse(userInfo || "{}")

            //verificar se recebemos as informações
            if(Object.keys(hasUser).length > 0){
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`
                setUser({
                    id: hasUser.id,
                    name: hasUser.name,
                    email: hasUser.email,
                    token : hasUser.token
                })
            }
            setLoading(false)
        }
        getUser()
    }, [])

    async function signIn({email, password}: SignInProps){
        setLoadingAuth(true)

        try {
            const response = await api.post('/session', {
                email, 
                password
            })

            const {id, name, token} = response.data;

            const data = {
                ...response.data
            };

            await AsyncStorage.setItem('@pizzaria', JSON.stringify(data))

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setUser({
                id,
                name,
                email,
                token
            })
            setLoadingAuth(false)
        } catch (error) {
            console.log("erro ao acessar", error);
            setLoadingAuth(false)
        }
        
    }

    async function signOut(){
        await AsyncStorage.clear().then(()=>{setUser({id: '', name: '', email: '', token: ''})})
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, loading, loadingAuth, signOut, socket, isConnected }}>
            {children}
        </AuthContext.Provider>
    )
}