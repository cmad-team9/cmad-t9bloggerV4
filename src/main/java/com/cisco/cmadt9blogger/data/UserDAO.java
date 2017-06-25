package com.cisco.cmadt9blogger.data;

import com.cisco.cmadt9blogger.api.User;

public interface UserDAO {
	void createUser(User user);
	User readUser(String userId);
	void updateUser(User user);
	void deleteUser(String userId);
}
