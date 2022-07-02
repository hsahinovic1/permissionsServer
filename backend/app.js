import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import User from "./models/UserModel.js";
import Group from "./models/GroupModel.js";
import Permission from "./models/PermissionModel.js";
import Object from "./models/ObjectModel.js";
import UserGroup from "./models/UsersGroupsModel.js";
import PermObjGroup from "./models/PermObjGroupModel.js";
import PermObjUser from "./models/PermObjUserModel.js";

const app = express()


app.get('/',(req,res)=>{
    res.send("Api is running")
})

app.listen(3000, console.log("Server running on port 3000"))

User.belongsToMany(Group, {
    through: UserGroup
  });
Group.belongsToMany(User, {
    through: UserGroup
  });

User.hasMany(PermObjUser, {
    foreignKey: 'user_id'
  });
Permission.hasMany(PermObjUser, {
    foreignKey: 'permission_id'
  });
Object.hasMany(PermObjUser, {
    foreignKey: 'object_id'
  });
  PermObjUser.belongsTo(User, { targetKey: 'id', foreignKey: 'user_id' });
  PermObjUser.belongsTo(Permission, { targetKey: 'id', foreignKey: 'permission_id' });
  PermObjUser.belongsTo(Object, { targetKey: 'id', foreignKey: 'object_id' });

Group.hasMany(PermObjGroup, {
    foreignKey: 'group_id'
  });
Permission.hasMany(PermObjGroup, {
    foreignKey: 'permission_id'
  });
Object.hasMany(PermObjGroup, {
    foreignKey: 'object_id'
  });
  PermObjGroup.belongsTo(Group, { targetKey: 'id', foreignKey: 'group_id' });
  PermObjGroup.belongsTo(Permission, { targetKey: 'id', foreignKey: 'permission_id' });
  PermObjGroup.belongsTo(Object, { targetKey: 'id', foreignKey: 'object_id' });

  sequelize
  .sync()
  .then(() => console.log("Database synced."))
  .catch((err) => console.log(err));