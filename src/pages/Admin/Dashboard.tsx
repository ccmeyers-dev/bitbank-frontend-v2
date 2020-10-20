import React, { useState, useContext } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonText,
  IonList,
  IonInput,
  IonItem,
  IonLabel,
  NavContext,
  IonRouterLink,
} from "@ionic/react";
import { arrowBack, person } from "ionicons/icons";
import Refresher from "../../components/utils/Refresher";
import "./styles/Dashboard.scss";
import { LoadingList } from "../../components/ListLoader";
import { config } from "../../app.config";
import useSecureRequest from "../../Hooks/SecureRequest";

interface UserProp {
  account: {
    email: string;
    is_admin: boolean;
  };
  id: number;
  current: number;
  full_name: string;
  trader_id: string;
  pending_trades: number;
  pending_withdrawals: number;
}

interface UserItemProp {
  id: number;
  isAdmin: boolean;
  full_name: string;
  email: string;
  balance: number;
  trades: number;
  withdrawals: number;
}
const UserItem: React.FC<UserItemProp> = ({
  id,
  isAdmin,
  full_name,
  email,
  balance,
  trades,
  withdrawals,
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
        <p>
          {trades ? <span className="trades">{trades}T</span> : " "}{" "}
          {withdrawals ? (
            <span className="withdrawals">{withdrawals}W</span>
          ) : (
            " "
          )}
        </p>
      </IonLabel>
    </IonItem>
  );
};

const Dashboard: React.FC = () => {
  const { goBack } = useContext(NavContext);

  const [searchValue, setSearchValue] = useState<string>("");

  const { data: users } = useSecureRequest("/users/portfolios/");
  const { data: admin } = useSecureRequest("/users/admin/");

  let results: UserProp[];

  if (searchValue.length > 3) {
    results = users.filter(
      (user: any) =>
        user.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.account.email.toLowerCase().includes(searchValue.toLowerCase())
    );
  } else {
    results = users;
  }

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
        {admin && (
          <>
            <div className="overview">
              <div className="welcome">
                <h1>Welcome {admin.name}</h1>
                <p>({config.name})</p>
                {admin.withdrawals || admin.trades ? (
                  <p>
                    Hi {admin.name}, you have some{" "}
                    {admin.trades ? "Trades" : ""}{" "}
                    {admin.trades && admin.withdrawals ? "and" : ""}{" "}
                    {admin.withdrawals ? "Withdrawals" : ""} you should attend
                    to
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className="statistics">
                <div className="card">
                  <h3>Users</h3>
                  <p>{admin.users}</p>
                </div>
                <div className="card">
                  <h3>Trades</h3>
                  <p className={admin.trades && "pending"}>{admin.trades}</p>
                </div>
                <div className="card">
                  <h3>Withdrawals</h3>
                  <p className={admin.withdrawals && "pending"}>
                    {admin.withdrawals}
                  </p>
                </div>
              </div>
            </div>

            <IonRouterLink routerLink="/sudo/wallets">
              {admin.dummy_wallets ? (
                <div className="wallets error">
                  <p>Please fill wallets</p>
                </div>
              ) : (
                <div className="wallets">
                  <p>Edit wallets</p>
                </div>
              )}
            </IonRouterLink>
          </>
        )}

        <div className="search-box">
          <IonInput
            placeholder="Search users..."
            clearInput
            value={searchValue}
            onIonChange={(e) => setSearchValue(e.detail.value!)}
          />
        </div>
        {!users ? (
          <LoadingList />
        ) : (
          <IonList mode="ios">
            {results.length > 0 ? (
              results.map((user) => (
                <UserItem
                  key={user.trader_id}
                  id={user.id}
                  isAdmin={user.account.is_admin}
                  email={user.account.email}
                  full_name={user.full_name}
                  balance={user.current}
                  trades={user.pending_trades}
                  withdrawals={user.pending_withdrawals}
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
