
document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();


        let theurl = "/api/resources";

        fetch(`${theurl}/${this.querySelector('[type=email]')}`)
            .then((res) => res.json())
            .then((data) => {
                if(!data.x) {
                    document.querySelector('form').submit();
                }
            })
        .catch(()=>{console.log("error")});

    })
})