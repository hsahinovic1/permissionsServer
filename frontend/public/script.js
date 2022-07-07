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
              td.appendChild(document.createTextNode(text.slice(0,-2)));
              document.getElementById("permissions").appendChild(td);
              text="";
             })    
        } 
      }
    }); 
};
permissionsModule.getGroupUsers = function(){
    
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
                  text += val.Group + ": "; 
            val.Users?.forEach(function(val2){ 
                text += val2 + ", "; })
                let td = document.createElement('li');
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
      body: JSON.stringify({userName: username, groupName: groupname}),
      dataType: "json",
      statusCode: {
          404: function () {
            console.log("404")
          },
          200: function (data) {
            document.getElementById("log").innerHTML="Korisnik dodan u grupu."
            permissionsModule.getGroupUsers();
        }
        
      }
    }); 
};
permissionsModule.addPermission = function(){
  let name = document.getElementsByName("name")[0].value;
  let permissionName = document.getElementsByName("permissionName")[0].value;
  let objectName = document.getElementsByName("permissionName")[0].value;
$.ajax({
    type: "POST",
    url: "/permissions/addPermission",
    contentType: "application/json",
    body: {name: name, permissionName: permissionName, objectName: objectName},
    dataType: "json",
    statusCode: {
        404: function () {
          console.log("404")
        },
        200: function (data) {
          document.getElementById("log").innerHTML="Permisija dodana."
          permissionsModule.getGroupUsers();
      }
    }
  }); 
};

