document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  var x='/emails/'+mailbox;
  fetch(x)
.then(response => response.json())
.then(emails => {
    // Print email
    console.log(emails);
    //getting demails view dom
    var n=emails["length"];
    for(i=0;i<n;i++)
    {
      var main_div=document.getElementById("emails-view");
      var h=document.createElement('div');
    //sender details
      if(mailbox=='inbox'){
        //changing unread mails
        if(!emails.read){
          h.style.backgroundColor = "LightGray";
        }
       if(emails.read)
       {
          h.style.backgroundColor = "red";
       }

        

      var div1=document.createElement('div');
      var node = document.createTextNode(emails[i]["sender"]);
      div1.appendChild(node); 
      h.appendChild(div1);
      console.log(emails[i]["sender"]);
    }
    else{
      var div1=document.createElement('div');
      var node = document.createTextNode(emails[i].recipients[0]);
      div1.appendChild(node); 
      h.appendChild(div1);
      console.log(emails[i].recipients[0]);
    }
      // to acess subjects 
      var div2=document.createElement('div');
      var node2=document.createTextNode(emails[i]["subject"]);
      div2.appendChild(node2);
      h.appendChild(div2);
      //to acess timestamps
      var div3=document.createElement('div');
      var node3=document.createTextNode(emails[i]["timestamp"]);
      div3.appendChild(node3);
      h.appendChild(div3);
      h.id="id1"
      main_div.appendChild(h);
      console.log(emails["length"]);
    }
}).catch(error=>{
  console.log(error);

  console.log("opps");
});
}

function sending_email()
{
  event.preventDefault()
  console.log("hello");
  
  var recipient=document.getElementById("compose-recipients").value;
  var sub=document.getElementById("compose-subject").value;
  var bodyy=document.getElementById("compose-body").value;
  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recipient,
      subject: sub,
      body: bodyy
  })
})
.then(response => response.json()
  )
.then(result => {

    // Print result
    console.log(result);
    for(var key in result){
      alert(result[key]);
    }

}).catch(error=>{
  console.log(error);

  console.log("opps");
});
load_mailbox('sent');

}
