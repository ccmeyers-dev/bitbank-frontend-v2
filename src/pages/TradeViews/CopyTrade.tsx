import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonText,
  IonList,
  IonInput,
  NavContext,
} from "@ionic/react";
import { arrowBack, ellipse } from "ionicons/icons";
import { useParams } from "react-router";
import Refresher from "../../components/utils/Refresher";
import "./styles/CopyTrade.scss";
import axiosInstance from "../../services/baseApi";
import { LoadingList } from "../../components/ListLoader";
import ErrorPage from "../../components/ErrorPage";
import { config } from "../../app.config";

interface TraderProp {
  id: number;
  full_name: string;
  trader_id: string;
  trade_score: number;
}

interface ProfileProp {
  trader: TraderProp;
}
const TraderProfile: React.FC<ProfileProp> = ({
  trader: { full_name, trader_id, trade_score },
}) => {
  const { wallet } = useParams();

  return (
    <div className="detail">
      <h5>{full_name}</h5>
      <div className="rating">
        <div className="entry">
          <h5>
            Trade score <IonIcon icon={ellipse}></IonIcon>
          </h5>
          <p>{trade_score}%</p>
        </div>
      </div>
      <div className="profile">
        <div className="entry">
          <h5>Trader ID</h5>
          <p>{trader_id}</p>
        </div>
        <div className="entry">
          <h5>Trade market</h5>
          <p>{wallet.toUpperCase()} / USD</p>
        </div>
      </div>

      <IonButton routerLink={`/tx/order/${wallet}/smart`} expand="block">
        <p>Copy Trade</p>
      </IonButton>
    </div>
  );
};

interface ListProp {
  trader: TraderProp | undefined;
  back: () => void;
}

const TraderBlock: React.FC<ListProp> = ({ trader, back }) => {
  return (
    <IonList mode="ios">
      {trader ? (
        <TraderProfile trader={trader} />
      ) : (
        <IonText className="no-result">
          <h3>No result found</h3>
          <p>Copy and paste Trader ID into the search box</p>
        </IonText>
      )}

      <IonButton onClick={back} color="light" size="small" className="go-back">
        Go back
      </IonButton>
    </IonList>
  );
};

const CopyTradeInfo: React.FC = () => {
  return (
    <div className="copy-trade-info">
      <p className="title">
        <span>CopyTrader&trade;</span>, {config.short_name}'s most important
        feature allows you to view what real traders are doing in real time and
        copy their trading automatically
      </p>
      <h5>How to Copy Trade?</h5>
      <div className="list">
        <ol>
          <li>Copy and paste Trader ID to pull trader profile</li>
          <li>Click "Copy" to automatically copy the trader positions</li>
          <li>Choose a total amount for the copy and start Trading</li>
        </ol>
      </div>
      <div className="info">
        <h1>When they trade, you trade</h1>
        <p>
          Whether you're a beginner learning the basics or you simply don't have
          time to watch the markets, now it's easy to leverage other traders'
          expertise. With {config.short_name}'s CopyTrader, you can
          automatically copy top-performing traders, instantly replicating their
          trading in your own portfolio.
        </p>
      </div>
      <p className="note">
        *Only accounts approved to participate in {config.short_name}'s
        CopyTrader&trade; Program are eligible to be copied.
      </p>
    </div>
  );
};

interface ActionProp {
  search: () => void;
}
const ActionButton: React.FC<ActionProp> = ({ search }) => {
  return (
    <div className="button">
      <IonButton mode="ios" onClick={search}>
        <p>Find</p>
      </IonButton>
    </div>
  );
};

const CopyTrade: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [trader, setTrader] = useState<TraderProp | undefined>();
  const [tradersList, setTradersList] = useState<TraderProp[]>([]);
  const [requested, setRequested] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { goBack } = useContext(NavContext);

  const findTrader = () => {
    setTrader(undefined);
    setRequested(true);
    tradersList.filter((td) => {
      if (td.trader_id === searchValue) {
        setTrader(td);
      }
      return trader;
    });
  };
  useEffect(() => {
    // console.log("fetching expert traders...");
    axiosInstance
      .get("users/expert-traders/")
      .then((res) => {
        setTradersList(res.data);
        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, []);
  return (
    <IonPage>
      <IonContent className="CopyTrade ion-padding">
        {/* refresher */}
        <Refresher />
        {loading ? (
          <LoadingList />
        ) : error ? (
          <ErrorPage />
        ) : (
          <>
            <IonIcon
              className="back-button"
              icon={arrowBack}
              onClick={() => goBack("/en/home")}
            />
            <div className="search-box">
              <IonInput
                type="text"
                value={searchValue}
                placeholder="Enter Trader ID"
                onIonChange={(e) => setSearchValue(e.detail.value!)}
                clearInput
              />
            </div>
            <ActionButton search={findTrader} />
            {requested ? (
              <TraderBlock trader={trader} back={() => setRequested(false)} />
            ) : (
              <CopyTradeInfo />
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CopyTrade;
