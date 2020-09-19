import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  NavContext,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./styles/About.scss";
import { config } from "../../../app.config";

const About: React.FC = () => {
  const { goBack } = useContext(NavContext);

  return (
    <IonPage>
      <IonContent className="About">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <div className="content">
          <IonListHeader lines="none">
            <h1>About</h1>
          </IonListHeader>
          <p className="intro">
            At {config.short_name}, we have been continuously transforming the
            traditional money management industry, in order to open the
            financial markets to everyone, everywhere.
          </p>

          <h2>Our Story</h2>
          <p className="block">
            For more than a decade, {config.short_name} has been a leader in the
            global Fintech revolution. It is the world’s leading social trading
            network, with millions of registered users and an array of
            innovative trading and investment tools.
          </p>

          <h2>Our Vision</h2>
          <p className="block">
            {config.short_name}'s vision is to open the global markets for
            everyone to trade and invest in a simple and transparent way.
          </p>

          <h2>Our Values</h2>
          <p className="desc">Simplicity</p>
          <p className="block">
            One of {config.short_name} ’s main goals is to remove barriers and
            make online trading and investing more accessible to the everyday
            user. Whenever people join {config.short_name} , we aim to make them
            feel a part of the platform from the very beginning. Moreover, we
            realize that many people use multiple platforms to manage their
            capital online, which is why we are constantly expanding our product
            offering to eventually include all of your financial needs under one
            roof.
          </p>

          <p className="desc">Openness</p>
          <p className="block">
            Openness and transparency are an integral part of the user
            experience on {config.short_name} . Whether it’s the ability to
            start a chat with any user on board, our CEO included, or the fact
            that we don’t charge any hidden fees and make sure our prices are
            clear and visible, we strive to make sure that our users feel that
            they have all the information they need to handle their finances on{" "}
            {config.short_name} .
          </p>

          <p className="desc">Innovation</p>
          <p className="block">
            We take great pride in the fact that we have been around since the
            earliest days of the Fintech Revolution. Whether by introducing new
            and exciting ways to trade and invest online or by inventing
            cutting-edge financial products – we are, and always will be,
            innovators and disruptors in the Fintech space.
          </p>

          <p className="desc">Enjoyable</p>
          <p className="block">
            We believe that people should be able to trade more than financial
            assets, like thoughts and feelings. On {config.short_name} , our
            users can interact and gain from each other’s experience. Our
            platform is intuitive and user-friendly, turning even the most
            complicated actions, like stock trading, to a simple and interactive
            experience.
          </p>
        </div>

        <div className="brand">
          <p>{config.short_name} Inc.</p>
          <small>{config.location}</small>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default About;
