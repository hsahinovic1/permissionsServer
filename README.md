# permissionsServer
Step 1 instal nodejs
Step 2 clone repository
Step 3 npm instal
Step 4 npm start
Server is supposed to run on localhost port: 3000
API Endpoints
1. @desc    add user to a group 
@route   POST /permissions/addUser
 data: { userName:string, groupName:string }

2. @desc    remove all users from group 
@route   DELETE /permissions/removeUsers
 data: { groupName:string }

3. @desc    add permission to a user or a group
@route   POST /permissions/addPermission
 data: { name:string, permissionName:string, objectName:string }

4. @desc    remove all permisions for a group or user
@route   DELETE /permissions/removePermissions
 data: { name:string }

5. @desc    for testing if a particular user has a particular permission over a particular object.
@route   POST /permissions/testPermission
 data: { name:string, permissionName:string, objectName:string }

6. @desc    for querying particular users permissions over a particular object.
@route   POST /permissions/getPermissions
 data:{ name:string, objectName:string }

7. @desc    for querying all Users and groups and their permissions permissions over all objects.
@route   GET /permissions/getAllPermissions

8. @desc    for querying all Users in groups.
@route   GET /permissions/getUsersFromGroup
