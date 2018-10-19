(function() {
    document.getElementById("toggle").addEventListener('change', handleChange);
    document.getElementById("login").addEventListener('click', checkStatus);
    chrome.identity.onSignInChanged.addListener(UnsetStorage);


    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            retainToggleState();
            checkStatus();
        }
    }

    function UnsetStorage() {
        localStorage.setItem("andelaPortalStatus", false);
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
        if (localStorage.getItem("andelaPortalStatus") === "true" ) {
            document.getElementById("overlay").style.display = "none";
        } else {
            authenticate();
        }
    }

    function authenticate() {
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
                    localStorage.setItem("andelaPortalStatus", false);
                    alert("wrong Gsuite account")
                    return;
                } else{
                    localStorage.setItem("andelaPortalStatus", true);
                    document.getElementById("overlay").style.display = "none";
                }
            })
        })
    }
})();
