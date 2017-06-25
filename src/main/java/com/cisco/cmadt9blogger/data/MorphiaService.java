package com.cisco.cmadt9blogger.data;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

import com.mongodb.MongoClient;

public class MorphiaService {

	private Morphia morphia;
	private Datastore datastore;

	public MorphiaService(){
		Properties prop = new Properties();
		InputStream input = null;
		try {
			input = getClass().getResourceAsStream("/env.properties");
			// load a properties file
			prop.load(input);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		// get the property value and print it out
		System.out.println("Database from properties file:"+prop.getProperty("database"));
		String dbStr = prop.getProperty("database");
		MongoClient mongoClient = new MongoClient(dbStr);
		//create a new morphia instance
		this.morphia = new Morphia(); 
		String databaseName = "blogger";
		this.datastore = morphia.createDatastore(mongoClient, databaseName);
	}

	public Morphia getMorphia() {
		return morphia;
	}

	public void setMorphia(Morphia morphia) {
		this.morphia = morphia;
	}

	public Datastore getDatastore() {
		return datastore;
	}

	public void setDatastore(Datastore datastore) {
		this.datastore = datastore;
	}

}
