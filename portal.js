(function() {
    document.getElementById("toggle").addEventListener('change', handleChange);
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            retainToggleState();
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
            console.log("I should be false");
            document.body.classList.remove('night');
        }
    }
})();
