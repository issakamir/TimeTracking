import {Session} from "@supabase/supabase-js";
import {createContext, ReactNode, useEffect, useState, useContext} from "react";
import {supabase} from "@/lib/supabase";
import {View} from "react-native";
import Auth from "@/components/Auth";


type Data={
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
}

type Profile={
  username: string | null,
  avatar_url: string | null,
}

const AuthContext=createContext<Data | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const[loading, setLoading] = useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
      setLoading(false);
    });
    const {data: authListener}=supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return ()=>{
      authListener.subscription.unsubscribe();
    }
  },[]);

  useEffect(()=>{
    if (!session?.user){
      setProfile(null);
      return
    };

    async function fetchUser() {
      try {
        const {data, error} = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", session?.user.id)
          .single();

        if(error) throw error;
        if(data){
          setProfile(data);
        }
      }
      catch(e){
        console.error("Error fetching user");}
    };
    fetchUser();
  }, [session?.user?.id]);


  if (loading) return <View />;

  if (!session) return <Auth />;


  return(
    <AuthContext.Provider value={{session, loading, profile}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=>{
  const context=useContext(AuthContext);
  if(context===undefined){
    throw new Error("useAuth must be used within useAuthProvider");
  }
  return context;
}