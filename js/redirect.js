(function(){
    console.log("radi")
    auth.onAuthStateChanged(user => {
        if(user)
        {
            console.log("if se zove")
        }
        else
        {
            console.log("else se zove")
           var newURL = window.location.origin + "/login.html" 
             window.location.replace(newURL);
        }
    });
    
})();