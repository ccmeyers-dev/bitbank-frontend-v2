import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import "./styles/HomePage.scss";
import Refresher from "../../components/utils/Refresher";
import { Switch, Route } from "react-router";
import More from "./More";
import Home from "./Home";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="HomePage">
        <Refresher />
        {/* {showMore ? <More toggle={toggleShow} /> : <Home toggle={toggleShow} />} */}

        <Switch>
          <Route path="/home" exact>
            <Home />
          </Route>
          <Route path="/home/more" exact>
            <More />
          </Route>
        </Switch>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
