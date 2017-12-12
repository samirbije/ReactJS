import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
  let errors = [];

  if (Validator.isEmpty(data.email)) {
    errors.email = 'This Email field is required';
  } else if (!Validator.isEmail(data.email)) {
            errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(data.password)) {
        errors.password = 'This Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}