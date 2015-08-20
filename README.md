# Simple Form Validator

This is a super simple vanilla JavaScript form validator. It's specifically written so as not to have any dependencies on jQuery or other libraries. It's super basic and probably won't solve all the worlds problems when it comes to validation, but it definitely does the trick for basic front end form validation.

When a field fails validation, a dynamic error message will be dropped into the DOM, adjecent to the form field.

#### Parameters

| Type | Name | Description |
|------|------|-------------|
| ``string`` | ``formSelector`` | ID or Classname used to target the form element. |
| ``object`` | ``options`` | Configuration object which defines how each form field should be validated. |


#### Available Tests

| Test | Description          |
| ------------- | ----------- |
| ``email`` | Test to ensure that the email is formatted properly. |
| ``minLength`` | Test to ensure the form field value does not contain less than the minimum number of characters. |
| ``maxLength`` | Test to ensure the form field value does not contain more than the maximum number of characters. |
| ``equals`` | Test to ensure the value of the form field matches the value being provided in the configuration object. |
| ``date`` | Test to ensure the form field value matches the following date format: ``MM/DD/YYYY`` |
| ``requireNumbers`` | Test to ensure that the form field value contains at least one number. |
| ``requireUppercase`` | Test to ensure that the form field value contains at least one uppercase letter. |
| ``requireLowercase`` | Test to ensure that the form field value contains at least one lowercase letter. |
| ``requireSymbols`` | Test to ensure that the form field value contains at least one special character. |


#### Basic Configuration

```javascript
// Validate a basic text field.
var options = {
	// List of form fields
	fields : {
    	// Specify the form field to validate using the "name" attribute of that field.
		'user-name' : {
        	// List of rules to validate against.
			rules : {
				maxLength : 20,
				minLength : 1
			},
            // Show a generic error message to show if any of the tests fail.
			message : 'Sorry, this username is invalid.'
		}
	}
};
```

#### Slightly More Complex Configuration

```javascript
// Validate a basic text field.
var options = {
	// List of form fields
	fields : {
    	// Specify the form field to validate using the "name" attribute of that field.
		'user-name' : {
        	// Rules for the username field.
			rules : {
				maxLength : 20,
				minLength : 1
			},
            // Show specific messages based on which test fails.
			messages : {
				maxLength : 'Your username is too long.',
				minLength : 'Please choose a username.'
			}
		},
		'user-password' : {
        	// Rules for the password field.
			rules : {
				minLength : 7,
				maxLength : 20,
				requireSymbols : true,
				requireNumbers : true,
				requireUppercase : true,
				requireLowercase : true
			},
            // Show specific messages based on which test fails.
			messages : {
				minLength : 'Password must be at least 7 characters long.',
				maxLength : 'Password cannot be longer than 20 characters.',
				requireSymbols : 'Password must contain at least one symbol.',
				requireNumbers : 'Password must contain at least one number.',
				requireUppercase : 'Password must contain at least one uppercase letter.',
				requireLowercase : 'Password must contain at least one lowercase letter.'
			}
		}
	}
};
```

#### Basic Usage

Assuming you have your configuration setup, simply validate each of the form fields before submitting the form.

```
var options = { ...config... };
    
document.querySelector('.SubmitButton').addEventListener('click', function(event) {
	event.preventDefault();
    
    var isValid = AB.validate('.RegistrationForm', options);
    
    if (isValid) {
    	document.querySelector('.RegistrationForm').submit();
	}
});
```