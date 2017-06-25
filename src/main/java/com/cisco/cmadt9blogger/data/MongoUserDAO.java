package com.cisco.cmadt9blogger.data;

import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.dao.BasicDAO;
import org.mongodb.morphia.query.UpdateOperations;

import com.cisco.cmadt9blogger.api.User;

public class MongoUserDAO extends BasicDAO<User, String> implements UserDAO {


	public MongoUserDAO(Class<User> entityClass, Datastore ds) {
		super(entityClass, ds);
	}

	public void createUser(User user) {
		System.out.println("MongoUserDAO createUser user id:"+user.getUserId());
		save(user);
	}

	public User readUser(String userId) {		
		return get(userId);
	}

	public void updateUser(User user) {
		UpdateOperations<User> updateOptions = createUpdateOperations();

		if(user.getNickName() != null && user.getNickName().trim() != ""){
			updateOptions.set("nickName",user.getNickName());
		}
		if(user.getFirstName() != null && user.getFirstName().trim() != ""){
			updateOptions.set("firstName",user.getFirstName());
		}
		if(user.getLastName() != null && user.getLastName().trim() != "") {
			updateOptions.set("lastName",user.getLastName());
		}
		if(user.getPassword() != null && user.getPassword().trim() != "") {
			updateOptions.set("password",user.getPassword());
		}
		update(createQuery().field("userId").equal(user.getUserId()), updateOptions);

	}

	public void deleteUser(String userId) {
		deleteById(userId);

	}
}
