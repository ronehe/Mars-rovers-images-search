// a module for all string validation functions
const validatorModule = (() => {


    let onlyAlphabet = (name) => {
        return !/[^a-zA-Z]/.test(name)
    }

    let validateSamePassword = (password1, password2) => {

        return {
            isValid: (password1 === password2),
            message: 'The passwords don\'t match'
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




    const validateForm = (...elementObjects) => {
        let v = true
        elementObjects.forEach((elementObject) => {
            v=(v &&validateInput(elementObject.elem, elementObject.elemFunc))
        })
        return v

    }


    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }

    return {
        isValidName: validateName,
        isValidEmail: validateEmail,
        isPasswordsMatch: validateSamePassword,
        validateForm:validateForm

    }


})();
module.exports=validatorModule