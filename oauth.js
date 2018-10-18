
window.onload = function() {
    document.getElementById("login").addEventListener('click', removeOverlay);

    function removeOverlay() {
        
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
                // console.log(data);
                if (data.hd !== "andela.com") {
                    alert("wrong Gsuite account")
                } else{
                    document.getElementById("overlay").style.display = "none";
                }
            })
        })
    }
}
