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

User.belongsToMany(Permission, {
    through: PermObjUser
  });
Permission.belongsToMany(User, {
    through: PermObjUser
  });
Object.belongsToMany(Permission, {
    through: PermObjUser
  });
Permission.belongsToMany(Object, {
    through: PermObjUser
  });

Group.belongsToMany(Permission, {
    through: PermObjGroup
  });
Permission.belongsToMany(Group, {
    through: PermObjGroup
  });
Object.belongsToMany(Permission, {
    through: PermObjGroup
  });
Permission.belongsToMany(Object, {
    through: PermObjGroup
  });

  sequelize
  .sync()
  .then(() => console.log("Database synced."))
  .catch((err) => console.log(err));