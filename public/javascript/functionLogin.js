document.addEventListener('DOMContentLoaded', function(){

    let form = document.getElementById('loginForm')
    let inputs = document.querySelectorAll('input')
    let loginValidator = new formValidator(
        {elem: inputs[0], elemFunc: validatorModule.isValidEmail},
        {elem: inputs[1], elemFunc: validatorModule.isPasswordLong})

    form.addEventListener('submit', function(e){
        loginValidator.resetErrors();
        loginValidator.clientValidator();
        loginValidator.serverValidator('/api/resources/' + inputs[0].value + '/' + inputs[1].value, (data)=> {
            if(!data.isValid){
                loginValidator.errorLoc.classList.remove('d-none')
                loginValidator.errorLoc.innerHTML = data.status;
                e.preventDefault();
            }
        });

    })
})

const validatorModule = (() => {


    let onlyAlphabet = (name) => {
        return !/[^a-zA-Z]/.test(name)
    }

    let validateSamePassword = (password1, password2) => {

        return {
            isValid: (password1 === password2),
            message: 'The passwords don\'t match<br>'
        }
    }

    let validatePasswordLength = (password) => {
        return{
            isValid: (password.length > -1), //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
            message: 'Password must be at least 8 characters long'
        }
    }

    let validateName = (name) => {
        let v = onlyAlphabet(name) && (name);
        return {
            isValid: v,
            message: 'The input must consist letters and only letters'
        }
    }
    let validateEmail = (email) => {
        let v = (email);
        return {
            isValid: v,
            message: 'mail cant be empty '
        }
    }




    const validateForm = (elementObjects) => {
        let v = true
        elementObjects.forEach((elementObject) => {
            v = validateInput(elementObject.elem, elementObject.elemFunc) && v
        })
        return v

    }


    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML += v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }

    return {
        isValidName: validateName,
        isValidEmail: validateEmail,
        isPasswordsMatch: validateSamePassword,
        isPasswordLong : validatePasswordLength,
        validateForm:validateForm,
    }
})();



let formValidator = function (...elemObjects) {
    this.elemObjects = elemObjects;
    this.errorLoc = document.querySelector('form').nextElementSibling;
    this.spinner = document.querySelector(".spinner-grow").parentElement;
    this.resetErrors = () => {elemObjects.forEach(element=>element.elem.nextElementSibling.innerHTML ='')}
    this.clientValidator = () => validatorModule.validateForm(this.elemObjects);
    this.serverValidator = (fetchLink, successFunction) => {
        this.spinner.classList.remove("d-none")
        this.errorLoc.classList.add('d-none')
        fetch(fetchLink)
            .then(res => {
                if (res.status >= 200 && res.status <= 299) {
                    return res.json()
                }
                else throw res.statusText;
            })
            .then(successFunction)
            .catch(err => {this.errorLoc.classList.remove('d-none')})
            .finally(() => {
                this.spinner.classList.add("d-none")}
            )
    }
}
