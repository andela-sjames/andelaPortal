(function() {
    document.getElementById("toggle").addEventListener('change', handleChange);
    function handleChange(e) {
       if (document.getElementById("toggle").checked === true) {
            document.body.classList.add("night");
       } else {
            document.body.classList.remove('night');
       }
    }
})();
