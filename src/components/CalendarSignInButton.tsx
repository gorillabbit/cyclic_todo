import { Button } from "@mui/material";
import { gapi } from "gapi-script";
import { useEffect, useState } from "react";

const config = {
  clientId: process.env.REACT_APP_GOOGLE_CALENDER_CLIENT_ID,
  apiKey: process.env.REACT_APP_GOOGLE_CALENDER_apiKey,
  scope: process.env.REACT_APP_GOOGLE_CALENDER_scope,
  discoveryDocs: [process.env.REACT_APP_GOOGLE_CALENDER_discoveryDocs],
};

interface CalendarSignInButtonProp {
  setIsGapiMounted: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalendarSignInButton: React.FC<CalendarSignInButtonProp> = ({
  setIsGapiMounted,
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const initClient = async () => {
      await gapi.client.init(config);
      await gapi.client.load("calendar", "v3");
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn;
      isSignedIn.listen(setSigninStatus);
      setSigninStatus(isSignedIn.get());
    };
    gapi.load("client:auth2", initClient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSigninStatus = (isSignedIn: boolean) => {
    setIsSignedIn(isSignedIn);
    setIsGapiMounted(isSignedIn);
  };

  const handleSignInClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };
  return (
    <Button
      variant="contained"
      onClick={isSignedIn ? handleSignOutClick : handleSignInClick}
    >
      {isSignedIn ? "Sign Out" : "Googleカレンダー連携"}
    </Button>
  );
};

export default CalendarSignInButton;
