# TMI PEOPLE


## Index

* [Agreements](#agreements)
  * [Agreement types](#agreement-types)
    * [Agreement type schema](#greement-type-schema)
    * [List Agreement types](#list-agreement-types)
    * [Find agreement types](#find-agreement-types)
    * [Create agreement type(s)](#create-agreement-types)
    * [Update agreement type(s)](#update-agreement-types)
    * [Delete agreement type(s)](#delete-agreement-types)
  * [Agreement schema](#agreement-schema) TODOC
  * [List agreements](#list-agreements) TODOC
  * [Find agreement](#find-agreements) TODOC
  * [Create agreement](#create-agreements) TODOC
  * [Update agreement](#update-agreements) TODOC
  * [Delete agreement](#delete-agreements) TODOC

* Collectives (TODOC)
* Posts (TODOC)
* Profiles (TODOC)
* Users (TODOC)

<br />

---


## Agreements

>Agreements are forged between users; collectives; and users and collectives.
These agreements represent relationships within the system and include:
>
>* friendship between users
>* invitations to, and member- and moderatorship between users and collectives
>* registration of projects between collectives.
>* any other kind of agreement our community wishes to create.


## Agreement types

```
http://127.0.0.1:3000/agreement
```

>The root endpoint of agreements allows management of *agreement types*.

<br />

### Agreement type schema

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement`
Request type| `GET`
Content-Type| `application/json;schema`

<br /><details><summary>Expected response</summary>

```JSON
{
    "code": 200,
    "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://tmi.mobi/agreement/agreement.schema.json",
        "definitions": {
            "uei": {
                "$ref": "http://tmi.mobi/root.schema.json#/definitions/uei"
            },
            "participantRef": {
                "$ref": "http://tmi.mobi/root.schema.json#/definitions/participantRef"
            }
        },
        "type": "object",
        "title": "string",
        "name": "string",
        "properties": {
            "id": {
                "$ref": "#/definitions/uei"
            },
            "owner": {
                "$ref": "#/definitions/participantRef"
            },
            "schema": {
                "type": "object"
            }
        },
        "required": [
            "name",
            "owner",
            "schema"
        ]
    }
}
```

Where ```schema:``` is the
[JSON schema](endpoints/agreement/agreement.schema.json) that
defines agreement types.

</details><br />

---

### List agreement types

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement`
Request type| `GET`
Content-Type| `application/json`

<br /><details><summary>Expected response</summary>

```JSON
{
    "status": "Success",
    "code": 200,
    "expose": true,
    "entities": [
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "administrator",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/agreement/administrator/administrator.schema.json",
                "type": "object",
                "title": "Administrator Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 0
        },
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "moderator",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/default/moderator.json",
                "type": "object",
                "title": "Moderator Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 1
        },
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "member",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/agreement/default/member.agreement.schema.json",
                "type": "object",
                "title": "Membership Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 2
        },
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "guest",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/default/guest.json",
                "type": "object",
                "title": "Guest Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 3
        }
    ]
}
```

</details><br />

---
### Find agreement types

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement?property=value&anotherProperty=etc`
Request type| `GET`
Content-Type| `application/json`

Where "property" and "anotherProperty" represent properties of the schema type,
eg.

`http://127.0.0.1:3000/agreement?name=guest`

<br /><details><summary>Expected response</summary>

```JSON
{
    "status": "Success",
    "code": 200,
    "expose": true,
    "entities": [
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "guest",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/default/guest.json",
                "type": "object",
                "title": "Guest Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 3
        }
    ]
}
```

</details><br />

---


### Create agreement type(s)

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement`
Request type| `POST`
Content-Type| `application/json`

<details><summary>Request body</summary>

```JSON
[
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "test-agreement",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/test-agreement",
                "type": "object",
                "title": "Test Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ],
                "properties": {
                    "newProp": {
                        "type": "string"
                    }
                }
            },
            "id": 4
        }
    ]
```

</details><br />

<details><summary>Expected response</summary>

```JSON
{
    "status": "Entities created",
    "code": 201,
    "expose": true,
    "entities": [
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "test-agreement",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/test-agreement",
                "type": "object",
                "title": "Test Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ],
                "properties": {
                    "newProp": {
                        "type": "string"
                    }
                }
            },
            "id": 4
        }
    ]
}
```

</details><br />

Creates a new agreement type and enpoint, in this case:
```
/agreement/test-agreement
```
that may now be used to create instances of the agreement type "test-agreement",
as per the provided name and schema.

<br />

---

### Update agreement type(s)

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement`
Request type| `PUT`
Content-Type| `application/json`

<details><summary>Request body</summary>

```JSON
[
	{
		"owner": {"entityType": "collective", "id": 0},
		"name": "test-agreement",
		"schema": {
			"$schema": "http://json-schema.org/draft-07/schema#",
			"$id": "http://tmi.mobi/schemas/agreement/default/guest.json",

			"type": "object",
			"title": "Test Agreement",

			"allOf": [
				{"$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"}
			],
			"properties": {
				"newProp": "boolean"
			}
		}
	}
]
```
</details>

</details><br />
<details><summary>Expected response</summary>

```JSON
{
    "status": "Success",
    "code": 200,
    "expose": true,
    "entities": [
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "test-agreement",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/test-agreement",
                "type": "object",
                "title": "Test Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ],
                "properties": {
                    "newProp": {
                        "type": "boolean"
                    }
                }
            },
            "id": 4
        }
    ]
}
```

</details><br />