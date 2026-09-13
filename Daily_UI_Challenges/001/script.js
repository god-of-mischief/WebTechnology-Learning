function checkPassword(form) {
  psw = form.psw.value;
  pswrepeat = form.pswrepeat.value;

  if (psw != pswrepeat) {
    alert("\nPassword did not match: Please try again...")
    return false;
  } else {
    alert("Password Match: Welcome to Micro-Service Payments!")
    return true;
  }
}