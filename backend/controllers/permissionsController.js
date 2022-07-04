import User from "../models/UserModel.js";
import Group from "../models/GroupModel.js";
import Permission from "../models/PermissionModel.js";
import Object from "../models/ObjectModel.js";
import UserGroup from "../models/UsersGroupsModel.js";
import PermObjGroup from "../models/PermObjGroupModel.js";
import PermObjUser from "../models/PermObjUserModel.js";

// @desc    add user to a group
// @route   POST /permissions/addUser
const addUserToGroup = async (req, res) => {
    try {
        const { userName, groupName } = req.body;

        let user = await User.findOrCreate({ where: { username: userName }, raw: true }).catch(err => {
            res.status(500).send({
                message: "Error occurred while adding user to a group."
            })
        });
        let group = await Group.findOrCreate({ where: { name: groupName }, raw: true }).catch(err => {
            res.status(500).send({
                message: "Error occurred while adding user to a group2."
            })
        });
        
        UserGroup.findOrCreate({
            where:{
            userId: user[0].id,
            groupId: group[0].id
        }}).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occurred while adding user to a group3."
            })
        });
    } catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    remove all users from group
// @route   DELETE /permissions/removeUsers
const removeUsersFromGroup = async (req, res) => {
    try {
        const { groupName } = req.body;

        let group = await Group.findOrCreate({ where: { name: groupName }, raw: true }).catch(err => {
            res.status(500).send({
                message: "Error removing users from a group."
            })
        });

        UserGroup.destroy({
            where: { groupId: group[0].id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Users were removed successfully!"
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

    } catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    add permission to a user or a group
// @route   POST /permissions/addPermission
const addPermission = async (req, res) => {
    try {
        const { name, permissionName, objectName } = req.body;

        let user = await User.findOne({ where: { username: name }, raw: true });
        let group = await Group.findOne({ where: { name: name }, raw: true });
        let permission = await Permission.findOrCreate({ where: { name: permissionName }, raw: true  });
        let object = await Object.findOrCreate({ where: { name: objectName }, raw: true  });

        if (user === null && group === null) {
            user = await User.create({   username: name , raw: true  });
        }
        
        if (group) {
            PermObjGroup.findOrCreate({
                where:{
                permission_id: permission[0].id,
                group_id: group.id,
                object_id: object[0].id
                }
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Error occurred while adding permission to a group."
                })
            });
        }
        else {
            PermObjUser.findOrCreate({
                where:{
                user_id: user.id,
                permission_id: permission[0].id,
                object_id: object[0].id
                }
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Error occurred while adding permission to a user."
                })
            });
        }
    } catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    remove all permisions for a group or user
// @route   DELETE /permissions/removePermissions
const removeAllPermissions = async (req, res) => {
    try {
        const { name } = req.body;


        let user = await User.findOne({ where: { username: name }, raw: true });
        let group = await Group.findOne({ where: { name: name }, raw: true });
        if (user === null && group === null) {
            user = await User.create({ username: name , raw: true  });
        }

        if (group) {
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
    } catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    for testing if a particular user has a particular permission over a particular object.
// @route   POST /permissions/testPermission
const testPermission = async (req, res) => {
    try {
        const { name, permissionName, objectName } = req.body;

        let user = await User.findOrCreate({ where: { username: name }, raw: true});
        let permission = await Permission.findOrCreate({ where: { name: permissionName }, raw: true });
        let object = await Object.findOrCreate({ where: { name: objectName }, raw: true });

        let sol = await PermObjUser.findOne({
            where: {
                user_id: user[0].id,
                permission_id: permission[0].id,
                object_id: object[0].id
            }
        })
        if (sol === null) {

            sol = await UserGroup.findAll({
                where:{
                    userId: user[0].id
                },
                include: 
                    {
                    model: Group,
                    include: {
                        model: PermObjGroup,
                        where: {
                            permission_id: permission[0].id,
                            object_id: object[0].id
                        }
                    }
                }
            })
        }
        else {
            res.send({
                message: "Permission found in users permissions!"
            });
        }
        sol.forEach(element => {
            if (element.group !== null) {
                res.send({
                    message: "Permission found in group permissions!"
                });
            }
        });
        
        res.send("Permission was not found");
    }
    catch (e) {
        res.send({ error: e.message });
    }
}

// @desc    for querying particular users permissions over a particular object.
// @route   POST /permissions/getPermissions
const getPermissions = async (req, res) => {
    try {
        const { name, objectName } = req.body;

        let user = await User.findOrCreate({ where: { username: name } });
        let object = await Object.findOrCreate({ where: { name: objectName } });

        let sol = await PermObjUser.findAll({
            attributes: [],
            where: {
                user_id: user.id,
                object_id: object.id
            },
            include: [{
                model: Permission,
                attributes: 'name',
                where: {
                    id: { $col: 'PermObjUser.permission_id' }
                }
            },
            {
                model: PermObjGroup,
                attributes: [],
                where: {
                    user_id: user.id,
                    object_id: object.id
                },
                include: [{
                    model: Permission,
                    attributes: 'name',
                    where: {
                        id: { $col: 'PermObjGroup.permission_id' }
                    }
                }]

            }]
        })
        if (sol === null) {

            sol = await PermObjGroup.findOne({
                where: {
                    permission_id: permission.id,
                    object_id: object.id,
                },
                include: {
                    model: PermObjGroup,
                    where: {
                        group_id: { $col: 'PermObjGroup.group_id' },
                        user_id: user.id
                    }
                }
            })
        }
        if (sol === null) {
            res.send({
                message: "Permission was not found!"
            });
        }
        res.send({
            message: "Permission was found successfully!"
        });
    }
    catch (e) {
        res.send({ error: e.message });
    }
}
export {
    addUserToGroup,
    removeUsersFromGroup,
    addPermission,
    removeAllPermissions,
    testPermission,
    getPermissions
  };