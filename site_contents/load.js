$(function(){
    $("#header-container").load("https://ratheronfire.com/header.html", function(response, status, xhr) {
        if (status == "error") {
            console.log("Failed to load header; falling back to localhost.")
            $("#header-container").load("http://localhost:8000/header.html");
        }
    });
});