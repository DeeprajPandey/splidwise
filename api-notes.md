# SpliDwise API Calls to Hyperledger Fabric

## Format of World State

```
{
	"(creditor_uid, debtor_uid)": [
		{
			"txid": 001,
			"amount": 20,
			"approved": false,
			"description": "Paid for dinner",
			"timestamp": 1586471276
		},
		{˛
			"txid": 002,
			"amount": 30,
			"approved": true,
			"description": "THC lunch",
			"timestamp": 1586554076
		}
	],
}
```

## Usage

Format for all the requests will be as follows
```
{
	"data": "This is a mixed type that will hold the content of the response",
	"message": "Additional metadata explaining what was going on with the request"
}
```

Rest of the documentation focuses on what will populate the `data` field.

### List all key-value pairs in the world state

**Definition**

`GET \worldState`

**Response**

- `200 OK` on success
```
{
	"(creditor_uid1, debtor_uid38)": [
		{
			"txid": 001,
			"amount": 20,
			"approved": false,
			"description": "Paid for dinner",
			"timestamp": 1586471276
		},
		{
			"txid": 002,
			"amount": 30,
			"approved": true,
			"description": "THC lunch",
			"timestamp": 1586554076
		}
	],
	"(creditor_uid3, debtor_uid6)": [
		{
			"txid": 001,
			"..."
		},
	],
}
```

### List all transactions between two specific users

**Definition**

`POST \queryUserTxns`

**Arguments**

- `"key": tuple` globally unique tuple of users which denotes txns where first uid paid for second uid

### Register a new user

**Definition**

`POST \registerUser`

**Arguments**

- `"userid": custom data-type` refer to fabchat userid generation and follow that to create globally unique user id/user chooses

**Response**

- `200 OK` on success
- Tentative structure
```
{
	(new_user, __blank__): []
}
```




