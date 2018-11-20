(function() {
    var storage = new Storage();
    var _toggle_ = document.getElementById("toggle");
    var _login_ = document.getElementById("login");
    var _authOverlay_ = document.getElementById("overlay");
    var _app_ = document.getElementById("app");
    var _alert_ = document.getElementById("alert");
    var _resources_ = {
        internal: document.getElementById("internal-resources"),
        external: document.getElementById("external-resources")
    };

    _alert_.style.display = "none";
    populateDOM();

    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            retainToggleState();
            // checkStatus();
            toggleDOMVisibility({
                auth: "none",
                app: "block"
            });
        }
    }

    function retainToggleState() {
        if (storage.get("nightMode")) {
            document.body.classList.add("night");
            document.getElementById("toggle").checked = true;
        } else {
            document.body.classList.remove("night");
        }
    }

    function checkStatus() {
        var currentDate = new Date();

        try {
            // if it throws an error then this is a new user.
            var expireObject = storage.get("expireObject");
            var expirationDate = expireObject.expiresAt;
        } catch(err) {
            authenticate();
        }

        if (Date.parse(currentDate) < Date.parse(expirationDate)) {
            toggleDOMVisibility({
                auth: "none",
                app: "block"
            });
        } else {
            // show Sign-In overlay if the time has expired.
            toggleDOMVisibility({
                auth: "block",
                app: "none"
            });
        }
    }

    function populateDOM() {
        Object.keys(RESOURCES).forEach(function(obj, index) {
            var key = _resources_[obj];
            registerDOMElement(RESOURCES[obj], key);
        });
    }

    function registerDOMElement(stack, element) {
        element.insertAdjacentHTML(
            'beforeend',
            '<div class="grid-container">' +
            stack.map(function(obj, index) {
                return (
                    '<div class="card">' +
                      '<a href="' + obj.link  + '" target="_blank">' +
                        obj.title +
                      '</a>' +
                    '</div>'
                )
            }).join('') +
            '</div>'
        )
    }

    function toggleDOMVisibility(options) {
        _authOverlay_.style.display = options.auth;
        _app_.style.display = options.app
    }

    function handleError(error, timeout) {
        _alert_.textContent = error;
        _alert_.style.display = "block";

        setTimeout(function() {
            _alert_.textContent = "";
            _alert_.style.display = "none";
        }, (timeout || 10000));
    }


    _toggle_.addEventListener("change", handleChange);
    _login_.addEventListener("click", authenticate);

    function handleChange(e) {
       if (document.getElementById("toggle").checked) {
            document.body.classList.add("night");
            storage.set("nightMode", true);
       } else {
            document.body.classList.remove("night");
            storage.set("nightMode", false);
       }
    }

    function authenticate() {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 3); // expire after 3 days.

        var expireObject = {
            "expiresAt": expirationDate
        };

        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            if (chrome.runtime.lastError) {
                storage.clear();
                return handleError(chrome.runtime.lastError.message);
            }

            var init = {
                method: "GET",
                async: true,
                cache: "default"
            };

            fetch("https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=" + token, init)
                .then((response) => response.json())
                .then(function(data) {
                    if (data.hd !== "andela.com") {
                        return handleError("GSuite Account not Supported");
                    } else {
                        storage.set("expireObject", expireObject);
                        toggleDOMVisibility({
                            auth: "none",
                            app: "block"
                        });
                    }
                })
                .catch(function(err) {
                    storage.clear();
                    toggleDOMVisibility({
                        auth: "block",
                        app: "none"
                    });
                    return handleError("An Error Occurred");
                });
        });
    }
})();
