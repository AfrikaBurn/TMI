# Configuration

This file describe the use of the configuration file:
[config.json](./config.json).


```
{
	// Name of this microservice collection:
	"name": "Tribe Core",
	// Port to listen on for requests:
	"port": 3000,

	// Collection of microservices:
	"minions": {

		// Defines a minion to manage sessions:
		"Session":{
			// URL path it binds to:
			"path": "session",
			// Name of the controller service class:
			"service": "SessionService",
			// Session identifier encryption salt:
			"salt": "default salt",
			// Name of the minion responsible for managing users. Used to authenticate
			// users and populate the user object within sessions:
			"userMinion": "User"
		},

		// Defines a minion to manage users:
		"User": {
			// User object schema:
			"schema": "user",
			// Name of the controller service class:
			"service": "UserService",
			// Name of the data stash class. MemoryStash stores data in the memory and
			will forget all data once the server is stopped.
			"stash": "MemoryStash"
		}

	},

	"origins": ["http://localhost:4200"]
}
```
