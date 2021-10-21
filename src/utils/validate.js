function isVietnamesePhoneNumber(number) {
  return /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/.test(number);
}
function isEmail(email) {
  const regx =
    /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regx)) {
    return true;
  } else {
    return false;
  }
}
export default { isEmail, isVietnamesePhoneNumber };
