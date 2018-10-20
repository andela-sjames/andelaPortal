(function() {
    document.getElementById("toggle").addEventListener('change', handleChange);
    document.getElementById("login").addEventListener('click', authenticate);

    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            retainToggleState();
            checkStatus();
        }
    }

    function handleChange(e) {
       if (document.getElementById("toggle").checked === true) {
            document.body.classList.add("night");
            localStorage.setItem("andelaPortalToggle", true)
       } else {
            document.body.classList.remove('night');
            localStorage.setItem("andelaPortalToggle", false)
       }
    }

    function retainToggleState(e) {
        if (localStorage.getItem("andelaPortalToggle") === "true" ) {
            document.body.classList.add("night");
            document.getElementById("toggle").checked = true;
        } else {
            document.body.classList.remove('night');
        }
    }

    function checkStatus() {
        var currentDate = new Date();
        var expireObject = JSON.parse(localStorage.getItem('expireObject'));

        try {
            // if it throws an error then this is a new user. 
            var expirationDate = expireObject.expiresAt;
        } catch(err) {
            authenticate();
        }

        if (Date.parse(currentDate) < Date.parse(expirationDate)) {
            document.getElementById("overlay").style.display = "none";
        } else {
            // show Sign-In overlay if the time has expired. 
            document.getElementById("overlay").style.display = "block";
        }
    }

    function authenticate() {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 3); // expire after 3 days.

        var expireObject = {
            "expiresAt": expirationDate,
        }

        chrome.identity.getAuthToken({interactive: true}, function(token) {
            if (chrome.runtime.lastError) {
                alert(chrome.runtime.lastError.message);
                    return;
            }
            var init = { 
                method: 'GET',
                async: true,
                cache: 'default'
            };

            fetch('https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token, init)
            .then((response) => response.json())
            .then(function(data) {
                if (data.hd !== "andela.com") {
                    alert("wrong Gsuite account")
                    return;
                } else{
                    localStorage.setItem('expireObject', JSON.stringify(expireObject));
                    document.getElementById("overlay").style.display = "none";
                }
            })
        })
    }
})();
