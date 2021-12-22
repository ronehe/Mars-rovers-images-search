 let validatorMod = require("./validatorModule")
document.querySelector("form").addEventListener("submit", function (e) {

    let password = this.querySelectorAll('input')[3]
    let password2 = this.querySelectorAll('input')[4]

    if (!validatorMod.validateForm({
        elem: password, elemFunc: ((password) => {
            return validatorModule.isPasswordsMatch(password, password2)
        })
    }))
        e.preventDefault();
})