/**
 * Contains all of the functionality and methods for super simple form validation.
 *
 * @author Aleks Blagojevich
 * @version  1.0
 * @namespace validate
 * @memberof AB
 * 
 */
AB.validate = (function () {
	
	var errorClass = 'error',
		tests = {};
	
	tests.email = function(value, validate) {
		var regx = /^(?:\w+\.?\+?)*\w+@(?:\w+\.)+\w+$/;
		if (validate) {
			return regx.test(value.trim());	
		}
	};
		
	tests.minLength = function(value, length) {
		return value.length >= length;
	};
		
	tests.maxLength = function(value, length) {
		return value.length <= length;
	};
		
	tests.equals = function(first, second) {
		return (first == second);
	};
		
	// matches mm/dd/yyyy (requires leading 0's (which may be a bit silly, what do you think?)
	// TODO: Validae different date formats
	tests.date = function (date, validate) {
		var regx = /^(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:\d{4})/;
		
		if (validate) {
			return regx.test(val);
		}
	};
		
	tests.requireNumbers = function(value, validate) {
		var regx = /^(?=.*\d).+$/;
		
		if (validate) {
			return regx.test(value);
		}
	};
		
	tests.requireUppercase = function(value, validate) {
		var regx = /^(?=.*[A-Z]).+$/;
		
		if (validate) {
			return regx.test(value);
		}
	};
		
	tests.requireLowercase = function(value, validate) {
		var regx = /^(?=.*[a-z]).+$/;
		
		if (validate) {
			return regx.test(value);
		}
	};
		
	tests.requireSymbols = function(value, validate) {
		var regx = /^(?=.*[-+_!@#$%^&*.,?]).+$/;
		
		if (validate) {
			return regx.test(value);
		}
	};
	
	function showErrorMessages(formSelector, errors) {
		
		var form = document.querySelector(formSelector),
			message,
			errorSpan;
			
		// Loop through the "errors" object so we can show the error messages to the user.
		for (var error in errors) {
			
			message = errors[error]; // The actual message from the "errors" object.
			formField = form.elements[error]; // The specific form field to target.
			
			// Add the error class to the input field.
			formField.classList.add(errorClass);
			
			// IF there is already an error message being displayed for this form field...
			// THEN don't add another one. Instead, just update the inner HTML.
			if (formField.nextElementSibling.classList.contains(errorClass)) {
				
				formField.nextElementSibling.innerHTML = message;
				
			} else {
				
				// IF there is NOT an existing error message for this input field...
				// THEN create a new one and add it next to the form field.
				errorSpan = document.createElement('span');
				errorSpan.classList.add(errorClass);
				errorSpan.innerHTML = message;
				formField.parentNode.insertBefore(errorSpan, formField.nextElementSibling);
				
			}
		}
	}
	
	function removeErrorMessages(formSelector, errors) {
		
		var form = document.querySelector(formSelector),
			elements = form.elements;
			
		// The idea here is that we will loop through all of the form fields and
		// remove the error messages from the fields that no longer need it.
		for (var i = 0; i < elements.length; i++) {
			
			if (elements[i].classList.contains(errorClass)) {
				// Remove the error class from the form field.
				elements[i].classList.remove(errorClass);
				// Remove the error message container for the form field.
				elements[i].parentNode.removeChild(elements[i].nextElementSibling);
			}
		}
		
	}
	
	function validateForm(formSelector, options) {
		
		var i,
			field, // Field
			name, // Name of the form field.
			value, // Value of the form field
			rules, // List of rules
			errors = {}, // Object which will contain all of the errors.
			formFields = document.querySelector(formSelector).elements; // All of the elements for this form.
			
		// Loop through all of the form field elements within the form being passed in.
		for (i = 0; i < formFields.length; i++ ) {
			
			field = formFields[i]; // The specific form field we've now looped to.
			name = field.name; // The name of the form field used for matching with the configuration object.
			value = field.value.trim(); // The value of the form field.
			rules = (typeof options.fields[name] !== 'undefined') ? options.fields[name].rules : ''; // The list of rules, if any.
			
			// Loop through all of the rules being specified
			// for this particular test and execute them.
			for (var rule in rules) {
				
				// If there is a rule being invoked that is not available, throw an error.
				if (typeof tests[rule] !== 'function') {
					throw new UserException('Sorry, ' + rule + ' does not exist as a validation test.');
				}
				
				// Using the appropriate test, check to see if the validation passes.
				// tests = list of methods which do the validation tests
				// tests[rule] = the specific test based on what rule being test. E.g. rules: { [maxLength] : 20 }
				// value = the value of the field we're validating
				// rules[rule] = the value for this particular test set in the validator's configuration object. E.g. rules : { minLength: [7] }
				// IF the test fails...
				// THEN add the error message to the errors object.
				if ( !tests[rule](value, rules[rule]) ) {
					
					// IF specific messages are provided for individual tests...
					if (typeof options.fields[name].messages !== 'undefined') {
						
						// THEN set the appropriate message depending on which test failed.
						errors[name] = options.fields[name].messages[rule];
						
					// IF a generic "validation failed" message was provided...
					} else if (typeof options.fields[name].message !== 'undefined') {
						// THEN use that message for the error.
						errors[name] = options.fields[name].message;
						
					} else {
						// The default error message in case one wasn't provided.
						errors[name] = 'Please verify your entry.'
					}
					
				}
			}
		}
		
		// Removing unnecessary error messages.
		// This handles the case when a user previously entered an
		// invalid value, returned to fix the error and then resubmits.
		removeErrorMessages(formSelector, errors);
		
		// If the error object does not contain any errors...
		if (Object.keys(errors).length === 0) {
			// Return true since validation passed.
			return true;
		}
			
		// Show error messages on the form next to the form fields.
		showErrorMessages(formSelector, errors);
		// Return false since validation failed.
		return false;
	}
	
	return validateForm;
	
})();