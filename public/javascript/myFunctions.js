
document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();


        let theurl = "/api/resources";

        fetch(`${theurl}/${this.querySelector('[type=email]')}`).

        catch();

    })


})