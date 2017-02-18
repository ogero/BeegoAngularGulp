package models

import (
	"errors"
)

var (
	UserList map[string]*User
)

func init() {
	UserList = make(map[string]*User)
	UserList["100"] = &User{"100", "admin@localhost.com", "1234", "Admin", "ExtrangeToken"}
	UserList["200"] = &User{"200", "john@localhost.com", "1234", "John", "AwesomeToken"}
	UserList["300"] = &User{"300", "jane@localhost.com", "1234", "Jane", "SuperrrToken"}
}

type User struct {
	Id       string
	Email    string
	Password string
	Name     string
	Token    string
}

func AuthorizeUserToken(token string) string {
	for _, u := range UserList {
		if u.Token == token {
			return u.Id
		}
	}
	return ""
}

func UpdateUser(uid string, uu *User) (*User, error) {
	if u, ok := UserList[uid]; ok {
		if uu.Email != "" {
			u.Email = uu.Email
		}
		if uu.Name != "" {
			u.Name = uu.Name
		}
		if uu.Password != "" {
			u.Password = uu.Password
		}
		return u, nil
	}
	return nil, errors.New("User Not Exist")
}

func UserLogin(username, password string) *User {
	for _, u := range UserList {
		if u.Email == username && u.Password == password {
			return u
		}
	}
	return nil
}
