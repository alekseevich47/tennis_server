/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "authAlert": {
      "enabled": false
    },
    "passwordAuth": {
      "enabled": false
    }
  }, collection)

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2524018571",
    "max": 0,
    "min": 0,
    "name": "max_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "authAlert": {
      "enabled": true
    },
    "passwordAuth": {
      "enabled": true
    }
  }, collection)

  // remove field
  collection.fields.removeById("text2524018571")

  return app.save(collection)
})
