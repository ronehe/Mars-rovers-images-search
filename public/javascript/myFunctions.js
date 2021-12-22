document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        let errMsg=document.getElementById("emailErrorMsg");
        if(errMsg.firstChild)
        errMsg.removeChild(errMsg.firstChild)

        let theurl = "/api/resources";
        let nameElem = this.querySelectorAll('input')[0]
        let lastNameElem = this.querySelectorAll('input')[1]
        let emailElem=this.querySelectorAll('input')[2]

        if (validateForm(nameElem, lastNameElem,emailElem))
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
// a module for all string validation functions
const validatorModule = (() => {


    let onlyAlphabet = (name) => {
        return !/[^a-zA-Z]/.test(name)
    }


    let validateName =(name) => {
        let v =  onlyAlphabet(name)&&(name);
        return {
            isValid: v,
            message: 'The input must consist letters and only letters'
        }
    }
    let validateEmail =(email) => {
        let v = (email);
        return {
            isValid: v,
            message: 'mail cant be empty '
        }
    }

    return {
        isValidName: validateName,
        isValidEmail:validateEmail
    }
})();
const validateForm = (name,lastName,email) => {
    let v1 = validateInput(name, validatorModule.isValidName)
    let v2 = validateInput(lastName, validatorModule.isValidName)
        let v3=validateInput(email,validatorModule.isValidEmail)
    return v1 && v2 && v3 ;
}

const validateInput = (inputElement, validateFunc) => {
    let errorElement = inputElement.nextElementSibling; // the error message div
    let v = validateFunc(inputElement.value); // call the validation function
    errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
    v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
    return v.isValid;
}
