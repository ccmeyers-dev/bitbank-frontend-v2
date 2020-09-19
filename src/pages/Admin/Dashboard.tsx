import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonText,
  IonList,
  IonInput,
  IonItem,
  IonLabel,
  NavContext,
} from "@ionic/react";
import { arrowBack, person } from "ionicons/icons";
import Refresher from "../../components/utils/Refresher";
import "./styles/Dashboard.scss";
import axiosInstance from "../../services/baseApi";
import { LoadingList, ErrorList } from "../../components/ListLoader";

interface UserProp {
  account: {
    email: string;
    is_admin: boolean;
  };
  id: number;
  current: number;
  full_name: string;
  trader_id: string;
}

interface UserItemProp {
  id: number;
  isAdmin: boolean;
  full_name: string;
  email: string;
  balance: number;
}
const UserItem: React.FC<UserItemProp> = ({
  id,
  isAdmin,
  full_name,
  email,
  balance,
}) => {
  return (
    <IonItem
      routerDirection="root"
      routerLink={`/sudo/profile/${id}`}
      className="UserItem ion-no-padding"
    >
      <div className={`icon ${isAdmin && "admin"}`}>
        <IonIcon icon={person} />
      </div>
      <IonLabel className="description">
        <h3>{full_name}</h3>
        <p>{email}</p>
      </IonLabel>
      <IonLabel className="amount">
        <h5>{balance.toFixed(2)} USD</h5>
      </IonLabel>
    </IonItem>
  );
};

const Dashboard: React.FC = () => {
  const { goBack } = useContext(NavContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState<UserProp[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    // console.log("fetching users...");
    axiosInstance
      .get("users/portfolios/")
      .then((res) => {
        let results;
        // console.log(res.data);
        if (searchValue.length > 1) {
          results = res.data.filter((users: any) =>
            users.full_name.toLowerCase().includes(searchValue.toLowerCase())
          );
        } else {
          results = res.data;
        }
        setUsers(results);
        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, [searchValue]);

  return (
    <IonPage>
      <IonContent className="AdminDashboard ion-padding">
        {/* refresher */}
        <Refresher />
        {/* <IonRouterLink routerDirection="back" routerLink="/en/settings"> */}
        <div className="back" onClick={() => goBack("/en/settings")}>
          <IonIcon className="back-button" icon={arrowBack} />
        </div>
        {/* </IonRouterLink> */}
        <div className="search-box">
          <IonInput
            placeholder="Search for users..."
            clearInput
            value={searchValue}
            onIonChange={(e) => setSearchValue(e.detail.value!)}
          />
        </div>
        <div className="button">
          <IonButton routerLink="/sudo/wallets" mode="ios">
            Wallet addresses
          </IonButton>
        </div>
        {loading ? (
          <LoadingList />
        ) : error ? (
          <ErrorList />
        ) : (
          <IonList mode="ios">
            {users.length > 0 ? (
              users.map((user) => (
                <UserItem
                  key={user.trader_id}
                  id={user.id}
                  isAdmin={user.account.is_admin}
                  email={user.account.email}
                  full_name={user.full_name}
                  balance={user.current}
                />
              ))
            ) : (
              <IonText className="no-result">
                <h3>No users found</h3>
                <p>Your users will appear here</p>
              </IonText>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
