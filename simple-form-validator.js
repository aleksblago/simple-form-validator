/**
 * @namespace AB
 * @author Aleks Blagojevich
 * 
 */
var AB = (window.AB || {});
 
/**
 * Contains all of the functionality and methods for form validation.
 *
 * @author Aleks Blagojevich
 * @version  1.0
 * @namespace validate
 * @memberof AB
 * 
 * @returns {object} AB.validate - Public methods
 * 
 */
AB.validate = (function () {
	
	var errorClass = 'error',
		test = {},
		options = {
			fieldErrorClass : errorClass,
			messageErrorClass : errorClass,
			fields : {}
		};
	
	/**
	 * Test the value of the email form field to verify that it is a valid email address.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} value Email address from the form field.
	 * @param  {boolean} validate Should we validate the email format?
	 * @return {boolean} Is the email being provided a valid email address?
	 * 
	 */
	test.email = function(value, validate) {
		var regx = /^(?:\w+\.?\+?)*\w+@(?:\w+\.)+\w+$/;
		if (validate) {
			return regx.test(value.trim());
		}
	};
	
	/**
	 * Test the value of the provided string to verify that it contains the minimum number of characters.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} value The string to test
	 * @param  {number} length The minimum string length
	 * @return {boolean} Does the string have at least the minimum number of characters?
	 * 
	 */
	test.minLength = function(value, length) {
		return value.length >= length;
	};
	
	/**
	 * Test the value of the provided string to verify that it does not contain more characters than are allowed.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} value The string to test
	 * @param  {number} length The maximum string length
	 * @return {boolean} Does the string have less than the maximum number of characters?
	 * 
	 */
	test.maxLength = function(value, length) {
		return value.length <= length;
	};
	
	/**
	 * Test the value of the provided items to test if they match or are equal.
	 * 
	 * @memberOf AB.validate
	 * @param  {string|number|node|object} first The first item to compare
	 * @param  {string|number|node|object} second The second item to compare
	 * @return {boolean} Do the two values match?
	 * 
	 */
	test.equals = function(first, second) {
		return (first == second);
	};
	
	/**
	 * Test the value of the provided date to make sure that it is in the correct format: MM/DD/YYYY
	 * 
	 * @memberOf AB.validate
	 * @param  {string} date The date to validate
	 * @param  {boolean} validate Should we validate the date?
	 * @return {boolean} Is the date provided in the correct format?
	 * 
	 */
	// TODO: Validate different date formats
	test.date = function (date, validate) {
		var regx = /^(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:\d{4})/;
		
		if (validate) {
			return regx.test(val);
		}
	};
	
	/**
	 * Test the value to determine whether or not the string contains any characters at all.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} value The string to validate
	 * @param  {boolean} validate Should we validate the string?
	 * @return {boolean} Does the string contain any characters at all?
	 * 
	 */
	test.requireSelection = function(fields, validate) {
		var elements;
		
		if (validate) {
			
			for (var i = 0; i < fields.length; i++) {
				if (fields[i].checked) {
					return true;
				}
			}
			
			return false;
		}
	};
	
	/**
	 * Test the value to determine whether or not the string contains at least one number.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} value The string to validate
	 * @param  {boolean} validate Should we validate the string?
	 * @return {boolean} Does the string contain at least one number?
	 * 
	 */
	test.requireNumbers = function(value, validate) {
		var regx = /^(?=.*\d).+$/;
		
		if (validate) {
			return regx.test(value);
		}
	};
	
	/**
	 * Test the value to determine whether or not the string contains at least one uppercase letter.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} value The string to validate
	 * @param  {boolean} validate Should we validate the string?
	 * @return {boolean} Does the string contain at least one uppercase letter?
	 * 
	 */
	test.requireUppercase = function(value, validate) {
		var regx = /^(?=.*[A-Z]).+$/;
		
		if (validate) {
			return regx.test(value);
		}
	};
	
	/**
	 * Test the value to determine whether or not the string contains at least one lowercase letter.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} value The string to validate
	 * @param  {boolean} validate Should we validate the string?
	 * @return {boolean} Does the string contain at least one lowercase letter?
	 * 
	 */
	test.requireLowercase = function(value, validate) {
		var regx = /^(?=.*[a-z]).+$/;
		
		if (validate) {
			return regx.test(value);
		}
	};
	
	/**
	 * Test the value to determine whether or not the string contains at least one special character.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} value The string to validate
	 * @param  {boolean} validate Should we validate the string?
	 * @return {boolean} Does the string contain at least one special character?
	 * 
	 */
	test.requireSymbols = function(value, validate) {
		var regx = /^(?=.*[-+_!@#$%^&*.,?]).+$/;
		
		if (validate) {
			return regx.test(value);
		}
	};
	
	/**
	 * Method to show error messages next to the form fields which did not pass validation.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} formSelector The css selector of the form to be validated
	 * @param  {object} errors List of key value pairs where the form field is associated with an error message.
	 * 
	 */
	function showErrorMessages(formSelector, errors) {
		
		var form = document.querySelector(formSelector),
			formField,
			previous,
			message,
			errorSpan;
			
		// Loop through the "errors" object so we can show the error messages to the user.
		for (var error in errors) {
			
			message = errors[error]; // The actual message from the "errors" object.
			formField = (form.elements[error].nodeType) ? form.elements[error] : form.elements[error][0]; // The specific form field to target. If the form field name is a collection, select the first one.
			
			// If there are any dupes, just go ahead and bypass those.
			if (formField.name === previous) {
				continue;
			}
			
			// Add the error class to the input field.
			formField.classList.add(options.fieldErrorClass);
			
			// IF the element has sibling elements AND...
			// IF that element is an error message container...
			// THEN update the innerHTML of that message container.
			// OTHERWISE create a new element and add it as a sibling to the form field.
			if (formField.nextElementSibling && formField.nextElementSibling.classList.contains(options.messageErrorClass)) {
				
				formField.nextElementSibling.innerHTML = message;
				
			} else {
				
				// IF there is NOT an existing error message for this input field...
				// THEN create a new one and add it as a sibling (immediately next) to the form field.
				errorSpan = document.createElement('span');
				errorSpan.classList.add(options.messageErrorClass);
				errorSpan.innerHTML = message;
				
				// IF there aren't any sibling elements...
				// THEN use appendChild to add the element...
				// OTHERWISE add the element using insertBefore.
				if (formField.nextElementSibling === null) {
					formField.parentNode.appendChild(errorSpan);
				} else {
					formField.parentNode.insertBefore(errorSpan, formField.nextElementSibling);
				}
				
			}
			
			previous = formField.name;
		}
	}
	
	/**
	 * Method to remove error messages if a form field passes validation.
	 * 
	 * @memberOf AB.validate
	 * @param  {string} formSelector The css selector of the form to be validated
	 * 
	 */
	function removeErrorMessages(formSelector) {
		
		var form = document.querySelector(formSelector),
			elements = form.elements;
			
		// The idea here is that we will loop through all of the form fields and
		// remove the error messages from the fields that no longer need it.
		for (var i = 0; i < elements.length; i++) {
			
			if (elements[i].classList.contains(options.fieldErrorClass)) {
				// Remove the error class from the form field.
				elements[i].classList.remove(options.fieldErrorClass);
				// Remove the error message container for the form field.
				elements[i].parentNode.removeChild(elements[i].nextElementSibling);
			}
		}
		
	}
	
	/**
	 * Method to show error messages next to the form fields which did not pass validation.
	 * 
	 * @memberOf AB.validate
	 * 
	 * @param  {string} formSelector The css selector of the form to be validated.
	 * @param  {object} config Configuration object to select which form fields need validation.
	 * @param  {object} config.fieldErrorClass The classname to use on the form field if validation fails.
	 * @param  {object} config.messageErrorClass The classname to use on the error message container if validation fails.
	 * @param  {object} config.field Object containing all of the form elements and rules for validation.
	 * 
	 * Please see the example code for clarity on config options.
	 * 
	 * @returns {boolean} Did any of the form fields pass validation?
	 * 
	 * @example
	 * AB.validate('.js-registration-form', {
	 *    fieldErrorClass : 'FormField-error',
	 *    messageErrorClass : 'ErrorMessage',
	 *    fields : {
	 *        // Use the "name" of the form field to select a specific field for validation.
	 *     	  'user-name' : {
	 *            rules : {
	 *                maxLength : 20,
	 *                minLength : 1
 	 *            },
	 *            // A generic message ican be displayed when any of the validation tests fail.
	 *            message : 'Please enter a valid username.'
	 *        },
	 *        'user-email' : {
	 *            rules : {
	 *                email : true
	 *            },
	 *            message : 'Please enter a valid email address.'
	 *        },
	 *        'user-password' : {
	 *            rules : {
	 *                minLength : 7,
	 *                maxLength : 20,
	 *                requireSymbols : true,
	 *                requireNumbers : true,
	 *                requireUppercase : true,
	 *                requireLowercase : true
	 *            },
	 *            // Specific messages can be displayed depending on which of the validation tests fail.
	 *            messages : {
	 *                minLength : 'Password must be at least 7 characters long.',
	 *                maxLength : 'Password cannot be longer than 20 characters.',
	 *                requireSymbols : 'Password must contain at least one symbol.',
	 *                requireNumbers : 'Password must contain at least one number.',
	 *                requireUppercase : 'Password must contain at least one uppercase letter.',
	 *                requireLowercase : 'Password must contain at least one lowercase letter.'
	 *            }
	 *        },
	 *        'user-confirm' : {
	 *            rules : {
	 *                equals : document.querySelector('.Registration-password').value
	 *            },
	 *            message : 'Passwords must match.'
	 *        }
	 *    }
	 * });
	 * 
	 */
	function validateForm(formSelector, config) {
		
		var i,
			field, // Field
			name, // Name of the form field.
			value, // Value of the form field
			rules, // List of rules
			result, // Result of validation test
			errors = {}, // Object which will contain all of the errors.
			formFields = document.querySelector(formSelector).elements; // All of the elements for this form.
			
		// Shallow extend the config object.
		for (var prop in config) {
			if (config.hasOwnProperty(prop)) {
				options[prop] = config[prop];
			}
		}
		
		// Loop through all of the form field elements within the form being passed in.
		for (i = 0; i < formFields.length; i++ ) {
			
			field = formFields[i]; // The specific form field we've now looped to.
			name = field.name; // The name of the form field used for matching with the configuration object.
			value = field.value.trim(); // The value of the form field. Trim the ends of the string but leave spaces intact.
			rules = (typeof options.fields[name] !== 'undefined') ? options.fields[name].rules : ''; // The list of rules, if any.
			
			// Loop through all of the rules being specified
			// for this particular test and execute them.
			for (var rule in rules) {
				
				// If there is a rule being invoked that is not available, throw an error.
				if (typeof tests[rule] !== 'function') {
					throw new UserException('Sorry, ' + rule + ' does not exist as a validation test.');
				}
				
				if (field.type === 'checkbox' || field.type === 'radio') {
					
					result = tests[rule](formFields[field.name], rules[rule]);
					
				} else {
					
					result = tests[rule](value, rules[rule]);
					
				}
				
				// Using the appropriate test, check to see if the validation passes.
				// tests = list of methods which do the validation tests
				// tests[rule] = the specific test based on what rule being test. E.g. rules: { [maxLength] : 20 }
				// value = the value of the field we're validating
				// rules[rule] = the value for this particular test set in the validator's configuration object. E.g. rules : { minLength: [7] }
				// IF the test fails...
				// THEN add the error message to the errors object.
				if ( !result ) {
					
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