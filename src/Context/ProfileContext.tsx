import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../services/baseApi";

export type ProfileType = {
  id: number;
  account: {
    id: number;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    region: string;
    password2: string;
    date_joined: string;
    last_login: string;
    is_superuser: boolean;
    is_admin: boolean;
    is_staff: boolean;
    is_active: boolean;
  };
  trader_id: string;
  trade_score: number | null;
  full_name: string;
  total: number;
  current: number;
  available: number;
  btc_total: number;
  btc_current: number;
  btc_available: number;
  eth_total: number;
  eth_current: number;
  eth_available: number;
  ltc_total: number;
  ltc_current: number;
  ltc_available: number;
  xrp_total: number;
  xrp_current: number;
  xrp_available: number;
};

interface ProfileContextType {
  profile: ProfileType;
  loading: boolean;
  error: boolean;
}

const ProfileContext = createContext<Partial<ProfileContextType>>({});
type Props = {
  children: React.ReactNode;
};

const ProfileProvider = ({ children }: Props) => {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfile = () => {
    // console.log("fetching profile...");
    axiosInstance
      .get("users/current/")
      .then((res) => {
        setProfile(res.data);
        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        // console.log("new err: ", err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};
const useProfile = () => useContext(ProfileContext);

export { ProfileProvider, useProfile };
