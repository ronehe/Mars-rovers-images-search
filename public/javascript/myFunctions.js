document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        let errMsg=document.getElementById("emailErrorMsg");
        errMsg.removeChild(errMsg.firstChild)

        let theurl = "/api/resources";

        fetch(`${theurl}/${this.querySelector('[type=email]').value}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.x) {
                    document.querySelector('form').submit();
                } else {
                    let findError = `<div class="card p-3 alert-warning "><h5 class="text-secondary"><b>
                                     <strong>Oh No !</strong> the email is already used :( </b></h5></div>`
                    document.getElementById("emailErrorMsg").innerHTML += findError
                }
            })
            .catch((e) => {
                console.log("error", e)
            });

    })
})