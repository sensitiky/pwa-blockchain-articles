import React, { useEffect } from 'react';

interface FacebookLoginProps {
  appId: string;
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const FacebookLogin: React.FC<FacebookLoginProps> = ({ appId }) => {
  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v11.0'
      });

      window.FB.AppEvents.logPageView();

      window.FB.getLoginStatus(function(response: any) {
        statusChangeCallback(response);
      });
    };

    (function(d, s, id){
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      const js = d.createElement(s) as HTMLScriptElement; 
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    }(document, 'script', 'facebook-jssdk'));
  }, [appId]);

  function statusChangeCallback(response: any) {
    if (response.status === 'connected') {
      const accessToken = response.authResponse.accessToken;
      fetch('http://localhost:3000/auth/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log('JWT Token:', data.access_token);
        // Store the JWT token in local storage or cookie
      })
      .catch((err) => console.error('Error:', err));
    } else {
      console.log('Not authenticated');
    }
  }

  function checkLoginState() {
    window.FB.getLoginStatus(function(response: any) {
      statusChangeCallback(response);
    });
  }

  return (
    <div>
      <div className="fb-login-button" 
           data-scope="public_profile,email" 
           data-onlogin="checkLoginState();">
      </div>
    </div>
  );
};

export default FacebookLogin;
