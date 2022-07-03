import User from "../models/UserModel.js";
import Group from "./models/GroupModel.js";
import Permission from "./models/PermissionModel.js";
import Object from "./models/ObjectModel.js";
import UserGroup from "./models/UsersGroupsModel.js";
import PermObjGroup from "./models/PermObjGroupModel.js";
import PermObjUser from "./models/PermObjUserModel.js";

// @desc    add user to a group
// @route   POST /permissions
// @access  Public
const addUserToGroup = async (req, res) => {
  try {
    const { userName, groupName } = req.body;

    let user = await User.findOne({ where: { username: userName } });

    if (user == null) {
        user = await User.create({
            username: userName
          }).catch(err => {
            res.status(500).send({
              message:
                e.message || "Error occurred while creating the user."
            })
        });
    } 
    user = await User.findOne({ where: { username: userName } });
    
    let group = await Group.findOne({ where: { name: groupName } });
    if (group == null) {
        group = await Group.create({
            name: groupName
          }).catch(err => {
            res.status(500).send({
              message:
                e.message || "Error occurred while creating the group."
            })
        });
    } 
    group = await Group.findOne({ where: { name: groupName } });
    
    UserGroup.create({
        userId: user.id,
        groupId: group.id
    }).then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
          message:
            e.message || "Error occurred while adding user to a group."
        })
    });
}catch (e) {
    res.send({ error: e.message });
  }
}

// @desc    remove all users from group
// @route   POST /permissions
// @access  Public
const removeUsersFromGroup = async (req, res) => {
    try {
      const {  groupName } = req.body;
  
      let group = await Group.findOne({ where: { name: groupName } });

      Group.destroy({
        where: { groupId: group.id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "users were removed successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete users from group with id=${id}. Maybe group was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete users from group with id=" + id
          });
        });

}catch (e) {
    res.send({ error: e.message });
    }
}

// @desc    add permission to a user or a group
// @route   POST /permissions
// @access  Public
const addPermission = async (req, res) => {
    try {
      const { name, permission, object } = req.body;
  
      let user = await User.findOne({ where: { username: name } });
      let group = await Group.findOne({ where: { name: name } });

      if (user == null && group == null) {
          user = await User.create({
              username: userName
            }).catch(err => {
              res.status(500).send({
                message:
                  e.message || "Error occurred while creating the user."
              })
          });
      } 
      user = await User.findOne({ where: { username: userName } });
      
      if(group){
        PermObjGroup.create({
            permission_id: permission.id,
            group_id: group.id,
            object_id: object.id
        }).then(data => {
            res.send(data);
          }).catch(err => {
            res.status(500).send({
              message:
                e.message || "Error occurred while adding permission to a group."
            })
        });
        }
        else{
            PermObjUser.create({
                user_id: user.id,
                permission_id: permission.id,
                object_id: object.id
            }).then(data => {
                res.send(data);
              }).catch(err => {
                res.status(500).send({
                  message:
                    e.message || "Error occurred while adding permission to a user."
                })
            });
        }
  }catch (e) {
      res.send({ error: e.message });
    }
}

// @desc    remove all users from group
// @route   POST /permissions
// @access  Public
const removePermission = async (req, res) => {
    try {
        const { name, permissionName, objectName } = req.body;
  
  
        let user = await User.findOne({ where: { username: name } });
        let group = await Group.findOne({ where: { name: name } });
        let permission = await Permission.findOne({ where: { name: permissionName } });
        let obj = await Object.findOne({ where: { name: objectName } });


        if(group){
            PermObjGroup.destroy({
        where: { group_id: group.id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Permission was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete permission !`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete permission!"
          });
        });
    }
    else {
        PermObjUser.destroy({
            where: { user_id: user.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Permission was deleted successfully!"
                });
              } else {
                res.send({
                  message: `Cannot delete permission!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Could not delete permission!"
              });
            });
    }
}catch (e) {
    res.send({ error: e.message });
    }
}