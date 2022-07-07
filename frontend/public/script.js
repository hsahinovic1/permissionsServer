permissionsModule = {};

permissionsModule.getAllPermissions = function(){
    
  $.ajax({
      type: "GET",
      url: "/permissions/getAllPermissions",
      contentType: "application/json",
      dataType: "json", statusCode: {
          404: function () {
            console.log("404")
          },
          200: function (data) {
            var text ="";      
            data.Users?.forEach(function(val){ 
              text += val.User + ":  ";

              val.Permissions.forEach(function(perm){ 
                if (typeof perm === 'string' || perm instanceof String)
                text += perm + ", ";
                else 
                perm?.forEach(perm2 => text += perm2 + ", ")
              })
             
              let td = document.createElement('li');
              td.onclick = permissionsModule.onclickPermissions;
              td.appendChild(document.createTextNode(text.slice(0,-2)));
              document.getElementById("permissions").appendChild(td);
              text="";
             })

             data.Groups?.forEach(function(val){ 
              text += val.Group + ":  ";

              val.Permissions.forEach(function(perm){ 
                text += perm + ", ";
               
              })
             
              let td = document.createElement('li');
              td.onclick = permissionsModule.onclickPermissions;
              td.appendChild(document.createTextNode(text.slice(0,-2)));
              document.getElementById("permissions").appendChild(td);
              text="";
             })    
        } 
      }
    }); 
};
permissionsModule.getGroupUsers = function(){
    
    
    document.getElementById("permissions").innerHTML='';
    $.ajax({
        type: "GET",
        url: "/permissions/getUsersFromGroup",
        contentType: "application/json",
        dataType: "json", statusCode: {
            404: function () {
              console.log("404")
            },
            200: function (data) {
              var text ="";
              data.forEach(function(val){ 
                  text += val.Group + ":  "; 
            val.Users?.forEach(function(val2){ 
                text += val2 + ", "; })
                let td = document.createElement('li');
                td.onclick = permissionsModule.onclick;
                td.appendChild(document.createTextNode(text.slice(0,-2)));
                document.getElementById("group-users").appendChild(td);
                text="";
            })
            
            permissionsModule.getAllPermissions();
          }
          
        }
      }); 
};
permissionsModule.addGroupUser = function(){
    let username = document.getElementsByName("userName")[0].value;
    let groupname = document.getElementsByName("groupName")[0].value;
  $.ajax({
      type: "POST",
      url: "/permissions/addUser",
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({userName: username, groupName: groupname}),
      dataType: "json",
      statusCode: {
          404: function () {
            console.log("404")
          },
          200: function (data) {
            document.getElementById("log").innerHTML="Korisnik dodan u grupu."
            document.getElementById("group-users").innerHTML='';
            permissionsModule.getGroupUsers();
        }
        
      }
    }); 
};

permissionsModule.onclick = function(event) {
  if (event.target.tagName != "LI") return;
  let lista = document.getElementById("group-users")
  let selected = lista.querySelectorAll('.selected');
  for(let elem of selected) {

    elem.classList.remove('selected');
  }
  event.target.classList.add('selected');
}

permissionsModule.clearGroup = function(){
  
  let lista = document.getElementById("group-users")
  if(lista.querySelectorAll('.selected').length==0)
  document.getElementById("log").innerHTML="Selektriraj grupu."
  else{
  let selected = lista.querySelectorAll('.selected')[0].innerHTML;
  let group = selected.substring(0,selected.search(':'));
$.ajax({
    type: "DELETE",
    url: "/permissions/removeUsers",
    contentType: "application/json",
    data: JSON.stringify({groupName:group}),
    dataType: "json",
    statusCode: {
        404: function () {
          console.log("404")
        },
        200: function (data) {
          document.getElementById("log").innerHTML="Permisija dodana.";
          document.getElementById("group-users").innerHTML='';
          permissionsModule.getGroupUsers();
      }
    }
  }); 
}
};

permissionsModule.addPermission = function(){
  let name = document.getElementsByName("name")[0].value;
  let permissionName = document.getElementsByName("permissionName")[0].value;
  let objectName = document.getElementsByName("objectName")[0].value;
$.ajax({
    type: "POST",
    url: "/permissions/addPermission",
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({name: name, permissionName: permissionName, objectName: objectName}),
    dataType: "json",
    statusCode: {
        404: function () {
          console.log("404")
        },
        200: function (data) {
          document.getElementById("log").innerHTML="Permisija dodana."
          document.getElementById("group-users").innerHTML='';
          permissionsModule.getGroupUsers();
      }
      
    }
  }); 
};
permissionsModule.clearPermissions = function(){
  
  let lista = document.getElementById("permissions")
  if(lista.querySelectorAll('.selected').length==0)
  document.getElementById("log").innerHTML="Selektriraj usera."
  else{
  let selected = lista.querySelectorAll('.selected')[0].innerHTML;
  let name = selected.substring(0,selected.search(':'));
$.ajax({
    type: "DELETE",
    url: "/permissions/removePermissions",
    contentType: "application/json",
    data: JSON.stringify({name:name}),
    dataType: "json",
    statusCode: {
        404: function () {
          console.log("404")
        },
        200: function (data) {
          document.getElementById("log").innerHTML="Permisije izbrisane.";
          document.getElementById("group-users").innerHTML='';
          permissionsModule.getGroupUsers();
      }
    }
  }); 
}
};
permissionsModule.onclickPermissions = function(event) {
  if (event.target.tagName != "LI") return;
  let lista = document.getElementById("permissions")
  let selected = lista.querySelectorAll('.selected');
  for(let elem of selected) {

    elem.classList.remove('selected');
  }
  event.target.classList.add('selected');
}