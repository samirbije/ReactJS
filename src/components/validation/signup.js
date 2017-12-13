import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
  let errors = {};

  /*if (Validator.isEmpty(data.username)) {
    errors.username = 'This Username field is required';
  }*/
  if (Validator.isEmpty(data.email)) {
      errors.email = 'This Email field is required';
  } else if (!Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(data.password)) {
      errors.password = 'This password field is required';
  }
  /*if (Validator.isEmpty(data.passwordConfirmation)) {
      errors.passwordConfirmation = 'This Password Confirmation field is required';
  }
  if (!Validator.equals(data.password, data.passwordConfirmation)) {
      errors.passwordConfirmation = 'Passwords must match';
  }
  */
  return {
    errors,
    isValid: isEmpty(errors)
  }
}