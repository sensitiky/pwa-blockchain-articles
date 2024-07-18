import { useEffect } from 'react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const useFacebookSDK = () => {
  useEffect(() => {
    const initializeFacebookSDK = () => {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId      : process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
          cookie     : true,
          xfbml      : true,
          version    : 'v12.0'
        });

        window.FB.AppEvents.logPageView();   
      };

      (function(d, s, id){
         let js: HTMLScriptElement, fjs = d.getElementsByTagName(s)[0] as HTMLScriptElement;
         if (d.getElementById(id)) {return;}
         js = d.createElement(s) as HTMLScriptElement; js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         if (fjs.parentNode) {
           fjs.parentNode.insertBefore(js, fjs);
         }
       }(document, 'script', 'facebook-jssdk'));
    };

    initializeFacebookSDK();
  }, []);
};

export default useFacebookSDK;
