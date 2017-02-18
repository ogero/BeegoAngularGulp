package controllers

import (
	"encoding/json"
	"github.com/ogero/BeegoAngularGulp/components"
	"github.com/ogero/BeegoAngularGulp/models"
)

// Operations about Users
type ApiUserController struct {
	components.ApiBaseController
}

// @Title Update
// @Description update the user
// @Param	uid		path 	string		true	"The uid you want to update"
// @Param	body		body 	models.User	true	"JSON Body for user content"
// @Param	X-Token		header 	string		true	"Authorization token"
// @Success 200 {object} models.User
// @Failure 400 :uid User id not specified
// @Failure 403 User can only update its own profile
// @Failure 404 User not exist. This should never happen.
// @Failure 401 Header Token is invalid
// @router /:uid [put]
func (c *ApiUserController) Put() {
	c.CheckAuthorization()
	uid := c.GetString(":uid")
	if uid != "" {
		if uid != c.AuthUserId {
			c.CustomAbort(403, "User can only update its own profile")
		}
		var u, uu *models.User
		var err error
		if err = json.Unmarshal(c.Ctx.Input.RequestBody, &u); err != nil {
			c.CustomAbort(400, "Bad data: ")
		}
		if uu, err = models.UpdateUser(uid, u); err != nil {
			c.CustomAbort(404, "User not exist " + err.Error())
		} else {
			c.Data["json"] = uu
			c.ServeJSON()
		}
	} else {
		c.CustomAbort(400, "User id not specified")
	}
}

// @Title Login
// @Description Logs user into the system
// @Param	username	query 	string	true	"The username for login"
// @Param	password	query 	string	true	"The password for login"
// @Success 200 {object} models.User
// @Failure 404 user not exist
// @router /login [get]
func (c *ApiUserController) Login() {
	var u *models.User
	username := c.GetString("username")
	password := c.GetString("password")
	if u = models.UserLogin(username, password); u != nil {
		c.Data["json"] = u
		c.ServeJSON()
	} else {
		c.CustomAbort(404, "User not exist")
	}
}

// @Title Logout
// @Description Logs out current logged in user session
// @Success 200 {string} Logout successfull
// @router /logout [get]
func (c *ApiUserController) Logout() {
	c.Data["json"] = "Logout successful"
	c.ServeJSON()
}

// @Title Test for forcefull logout
// @Description Test method that will ALWAYS return 401 for checking forcefull logouts
// @Failure 401 Header Token is invalid
// @router /testBadToken [get]
func (c *ApiUserController) TestBadToken() {
	c.CustomAbort(401, "Invalid Token")
}

