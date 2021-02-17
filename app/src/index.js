if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(reg => {
        console.log("SW registered!");
        console.log(reg);
    }).catch(error => {
        console.log("SW registration failed!");
        console.error(error);
    });
}