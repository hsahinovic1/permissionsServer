import User from "../models/UserModel.js";
import Group from "../models/GroupModel.js";
import Permission from "../models/PermissionModel.js";
import Object from "../models/ObjectModel.js";
import UserGroup from "../models/UsersGroupsModel.js";
import PermObjGroup from "../models/PermObjGroupModel.js";
import PermObjUser from "../models/PermObjUserModel.js";
import { Op } from "sequelize";

// @desc    add user to a group
// @route   POST /permissions/addUser
const addUserToGroup = async (req, res) => {
    try {
        const { userName, groupName } = req.body;

        let user = await User.findOrCreate({ where: { username: userName }, raw: true }).catch(err => {
            return res.status(500).send({
                message: "Error occurred while adding user to a group."
            })
        });
        let group = await Group.findOrCreate({ where: { name: groupName }, raw: true }).catch(err => {
            return res.status(500).send({
                message: "Error occurred while adding user to a group."
            })
        });

        UserGroup.findOrCreate({
            where: {
                userId: user[0].id,
                groupId: group[0].id
            }
        }).then(data => {
            return res.send(data);
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Error occurred while adding user to a group."
            })
        });
    } catch (e) {
        return res.send({ error: e.message });
    }
}

// @desc    remove all users from group
// @route   DELETE /permissions/removeUsers
const removeUsersFromGroup = async (req, res) => {
    try {
        const { groupName } = req.body;

        let group = await Group.findOrCreate({ where: { name: groupName }, raw: true }).catch(err => {
            return res.status(500).send({
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
                return res.status(500).send({
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
        let permission = await Permission.findOrCreate({ where: { name: permissionName }, raw: true });
        let object = await Object.findOrCreate({ where: { name: objectName }, raw: true });

        if (user === null && group === null) {
            user = await User.create({ username: name, raw: true });
        }

        if (group) {
            PermObjGroup.findOrCreate({
                where: {
                    permission_id: permission[0].id,
                    group_id: group.id,
                    object_id: object[0].id
                }
            }).then(data => {
                return res.send(data);
            }).catch(err => {
                return res.status(500).send({
                    message:
                        err.message || "Error occurred while adding permission to a group."
                })
            });
        }
        else {
            PermObjUser.findOrCreate({
                where: {
                    user_id: user.id,
                    permission_id: permission[0].id,
                    object_id: object[0].id
                }
            }).then(data => {
                return res.send(data);
            }).catch(err => {
                return res.status(500).send({
                    message:
                        err.message || "Error occurred while adding permission to a user."
                })
            });
        }
    } catch (e) {
        return res.send({ error: e.message });
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
            user = await User.create({ username: name, raw: true });
        }

        if (group) {
            PermObjGroup.destroy({
                where: { group_id: group.id }
            })
                .then(num => {
                    if (num == 1) {
                        return res.send({
                            message: "Permission was deleted successfully!"
                        });
                    } else {
                        return res.send({
                            message: `Cannot delete permission !`
                        });
                    }
                })
                .catch(err => {
                    return res.status(500).send({
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
                        return res.send({
                            message: "Permission was deleted successfully!"
                        });
                    } else {
                        return res.send({
                            message: `Cannot delete permission!`
                        });
                    }
                })
                .catch(err => {
                    return res.status(500).send({
                        message: "Could not delete permission!"
                    });
                });
        }
    } catch (e) {
        return res.send({ error: e.message });
    }
}

// @desc    for testing if a particular user has a particular permission over a particular object.
// @route   POST /permissions/testPermission
const testPermission = async (req, res) => {
    try {
        const { name, permissionName, objectName } = req.body;

        let user = await User.findOrCreate({ where: { username: name }, raw: true });
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
                where: {
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

        return res.send({
            message: "Permission not found!"
        });
    }
    catch (e) {
        return res.send({ error: e.message });
    }
}

// @desc    for querying particular users permissions over a particular object.
// @route   POST /permissions/getPermissions
const getPermissions = async (req, res) => {
    try {
        const { name, objectName } = req.body;

        let user = await User.findOrCreate({ where: { username: name }, raw: true });
        let object = await Object.findOrCreate({ where: { name: objectName }, raw: true });
        let sol2 = await Permission.findAll({
            include: [{
                model: PermObjGroup,
                required: false,
                where: {
                    object_id: object[0].id
                },
                include: [{
                    model: Object
                },
                {
                    model: Group,
                    include: {
                        model: User,
                        where: { id: user[0].id }
                    }
                }]
            },
            {
                model: PermObjUser,
                required: false,
                where: {
                    user_id: user[0].id,
                    object_id: object[0].id
                },
                include: User
            }
            ]
        });
        sol2 = await sol2.filter(function (value) {
            return value.group_permissions.length !== 0 || value.user_permissions.length !== 0;
        });
        return res.send(sol2.map(function (val) { return { 'Permission': val.name } }));

    }
    catch (e) {
        return res.send({ error: e.message });
    }
}
// @desc    for querying all Users and groups and their permissions permissions over all objects.
// @route   GET /permissions/getAllPermissions
const getAllPermissions = async (req, res) => {
    try {
        let sol2 = await User.findAll({
            attributes: {exclude: ['createdAt', 'updatedAt']},
            include: [{
                model: PermObjUser,
                attributes: {exclude: ['createdAt', 'updatedAt']},
                required: false,
                include: [{
                    model: Object,
                    attributes: ['name']
                },
            {
                model:Permission,
                attributes: ['name']
            }]
            },
            {
                model: Group,
                attributes: {exclude: ['createdAt', 'updatedAt']},
                required: false,
                include: {
                    model: PermObjGroup,
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [{
                        model: Object,
                        attributes: ['name']
                    },
                {
                    model:Permission,
                    attributes: ['name']
                }]
                }
            }
            ]
        });
        let sol3 =await Group.findAll({
            attributes: {exclude: ['createdAt', 'updatedAt']},
            include: {
                model: PermObjGroup,
                attributes: {exclude: ['createdAt', 'updatedAt']},
                required: false,
                include:[ {
                    model: Object,
                    attributes: ['name']
                },
            {
                model:Permission,
                attributes: ['name']
            }]
            }});
            
            // let sol4 = await sol2.map(function(val){return {"User": val.username,
            // "Permissions": val.groups.map(cal => cal.group_permissions?.map(val2 => val2.permission.name + " on " + val2.object.name))}});

            sol2 = await sol2.map(function(val){return {"User": val.username,
            "Permissions": [...val.user_permissions?.map(val2 => val2.permission.name + " on " + val2.object.name),
            ...val.groups.map(cal => cal.group_permissions?.map(val2 => val2.permission.name + " on " + val2.object.name))]
             }});
            sol3 = await sol3.map(function(val){return {"Group": val.name,
            "Permissions": val.group_permissions?.map(val2 => val2.permission.name + " on " + val2.object.name)}});

            return res.send({"Users" : sol2, "Groups" : sol3})
        
    }
    catch (e) {
        return res.send({ error: e.message });
    }
}
const getUsersFromGroup = async (req, res) => {
    let sol;
    try {
        sol = await Group.findAll({
            include: {
                model: User,
                attributes: ['username']
            }
        }).catch(e => sol = { message: e.message })
        
         sol = await sol.map(function(val){return {"Group": val.name,
        "Users": val.users?.map(val2 => val2.username )}});
        return res.send(sol)
    }
    catch (e) {
        return res.send({ error: e.message });
    }
}
export {
    addUserToGroup,
    removeUsersFromGroup,
    addPermission,
    removeAllPermissions,
    testPermission,
    getPermissions,
    getUsersFromGroup,
    getAllPermissions
};

