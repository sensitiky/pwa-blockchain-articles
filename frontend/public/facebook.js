window.fbAsyncInit = function() {
    FB.init({
        appId      : process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie     : true,
        xfbml      : true,
        version    : 'v11.0'
    });

    FB.AppEvents.logPageView();

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
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
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}
