
const sendSMS=(data)=>{
  const url = process.env.SMS_URL;
  const username = process.env.SMS_USERNAME;
  const password = process.env.SMS_PASSWORD;
  
  const requestOptions = {
  method: 'POST',
  headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
  },
  body: new URLSearchParams(data)
  };

  fetch(url, requestOptions)
  .then(response => Promise.all([response.json(), response.status]))
  .then(([data, httpCode]) => {
    // Handle the response data and HTTP code
    console.log("SMS sent");
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
  });
}

module.exports=sendSMS
