let validatorModule=require('./validatorModule.js')
document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        let errMsg = document.getElementById("emailErrorMsg");
        if (errMsg.firstChild)
            errMsg.removeChild(errMsg.firstChild)

        let theurl = "/api/resources";
        let nameElem = this.querySelectorAll('input')[0]
        let lastNameElem = this.querySelectorAll('input')[1]
        let emailElem = this.querySelectorAll('input')[2]

        if (validatorModule.validateForm({elem: nameElem, elemFunc: validatorModule.isValidName}
            , {elem: lastNameElem, elemFunc: validatorModule.isValidName}, {
                elem: emailElem,
                elemFunc: validatorModule.isValidEmail
            }))
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

// const validateForm = (name,lastName,email) => {
//     let v1 = validateInput(name, validatorModule.isValidName)
//     let v2 = validateInput(lastName, validatorModule.isValidName)
//         let v3=validateInput(email,validatorModule.isValidEmail)
//     return v1 && v2 && v3 ;
// }


