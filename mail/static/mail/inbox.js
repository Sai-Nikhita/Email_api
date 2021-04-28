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
  document.getElementById("display-details").style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.getElementById("display-details").style.display = 'none';

  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  let x='/emails/'+mailbox;
  fetch(x)
.then(response => response.json())
.then(emails => {
    // Print email
    console.log(emails);
    //getting demails view dom
    let n=emails["length"];
    let main_div=document.getElementById("emails-view");
    for(let i=0;i<n;i++)
    {
      
      let h=document.createElement('div');
    //sender details
      if(mailbox=='inbox'){
        //changing unread mails
        if(!emails[i].read){
          h.style.backgroundColor = "LightGray";
        }
       if(emails[i].read)
       {
          h.style.backgroundColor = "White";
       }
      let div1=document.createElement('div');
      let node = document.createTextNode(emails[i]["sender"]);
      div1.appendChild(node); 
      h.appendChild(div1);
      console.log(emails[i]["sender"]);
    }
    else{
      let div1=document.createElement('div');
      let node = document.createTextNode(emails[i].recipients[0]);
      div1.appendChild(node); 
      h.appendChild(div1);
      console.log(emails[i].recipients[0]);
    }
      // to acess subjects 
      let div2=document.createElement('div');
      let node2=document.createTextNode(emails[i]["subject"]);
      div2.appendChild(node2);
      h.appendChild(div2);
      //to acess timestamps
      let div3=document.createElement('div');
      let node3=document.createTextNode(emails[i]["timestamp"]);
      div3.appendChild(node3);
      h.appendChild(div3);
      h.id="id1";
      let email=emails[i];
      h.addEventListener("click",function(){
        display_mail(email.id,mailbox);
        changing_to_read(email.id);
      });
      main_div.appendChild(h);
      
     console.log(emails[i]["id"]);
      console.log(emails["length"]);
    }
}).catch(error=>{
  console.log(error);

  console.log("opps");
});
}
function display_mail(id,mailbox)
{ 
  
  /*var to=document.getElementById("to");
  var subject=document.getElementById("subject");
  var time=document.getElementById("time");*/

  document.getElementById("emails-view").style.display = 'none';
  //document.getElementById('compose-view').style.display = 'none';
  document.getElementById("display-details").style.display = 'block';

  var converting_tostring=id.toString();
  fetch('/emails/'+converting_tostring)
.then(response => response.json())
.then(email => {
    // Print email
    
    console.log(email);
    //to display details
    document.getElementById("from").innerHTML="<b>FROM: </B>"+email.sender+mailbox;
    document.getElementById("to").innerHTML="<b>To: </B>"+email.recipients[0];
    document.getElementById("subject").innerHTML="<b>Subject: </B>"+email.subject;
    document.getElementById("time").innerHTML="<b>Time: </B>"+email.timestamp+'<br><br>';
    document.getElementById("body").innerHTML="<br>"+email.body;
     if(mailbox!='sent'){
    let btn=document.createElement('button');
    if(mailbox=='archive'){
      var btntxt=document.createTextNode('unarchive');
    }
    else{
    var btntxt=document.createTextNode('archive');
  }
    btn.appendChild(btntxt);
    btn.addEventListener("click",function(){
      change_archieve(email.id,email.archived);
    });
    document.getElementById("time").appendChild(btn);

    
  }

   var btn1=document.createElement('button');
    var btntxt1=document.createTextNode('reply');
    btn1.appendChild(btntxt1);
    btn1.addEventListener("click",function(){
      replying_email(email.id,mailbox);
    });
    
    document.getElementById("time").appendChild(btn1);
  

});
  console.log(id);

}
function replying_email(mail_id,mailbox)
{
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.getElementById("display-details").style.display = 'none';
  var converting_tostring=mail_id.toString();
  fetch('/emails/'+converting_tostring)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);
    if(mailbox=='sent')
    {
      document.getElementById("compose-recipients").value=email.recipients[0];
      document.getElementById("compose-body").placeholder="On "+email.timestamp+" "+email.recipients[0]+" "+"wrote: "+email.body;
    }
    else
    {
      document.getElementById("compose-recipients").value=email.sender;
      document.getElementById("compose-body").placeholder="On "+email.timestamp+" "+email.sender+" "+"wrote: "+email.body;
    }
      document.getElementById("compose-recipients").disabled=true;
    if(email.subject.indexOf('Re:')==-1)
    {
        document.getElementById("compose-subject").value='Re:'+email.subject;
    }
    else{
      document.getElementById("compose-subject").value=email.subject;
    }

    
});
  

}
function changing_to_read(mail_id)
{
  console.log("readreadread");
  console.log(mail_id);
  var m_id=mail_id.toString();
  fetch('/emails/'+mail_id, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})
}
function change_archieve(mail_id,mail_archieve)
{
  var m_id=mail_id.toString();
  fetch('/emails/'+m_id, {
  method: 'PUT',
  body: JSON.stringify({
      archived: !mail_archieve
  })
});
  load_mailbox('inbox');
  location.reload();

}

function sending_email()
{
  event.preventDefault()
  console.log("hello");
  
  let recipient=document.getElementById("compose-recipients").value;
  let sub=document.getElementById("compose-subject").value;
  let bodyy=document.getElementById("compose-body").value;
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
    for(let key in result){
      alert(result[key]);
    }

}).catch(error=>{
  console.log(error);

  console.log("opps");
});
load_mailbox('sent');

}
