/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number4096299031",
    "max": null,
    "min": null,
    "name": "birth_year",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select660750991",
    "maxSelect": 1,
    "name": "hand",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Правая",
      "Левая"
    ]
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number138994849",
    "max": null,
    "min": null,
    "name": "rating_points",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number2060015326",
    "max": null,
    "min": null,
    "name": "games_count",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number2732118329",
    "max": null,
    "min": null,
    "name": "wins",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number724428801",
    "max": null,
    "min": null,
    "name": "losses",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("number4096299031")

  // remove field
  collection.fields.removeById("select660750991")

  // remove field
  collection.fields.removeById("number138994849")

  // remove field
  collection.fields.removeById("number2060015326")

  // remove field
  collection.fields.removeById("number2732118329")

  // remove field
  collection.fields.removeById("number724428801")

  return app.save(collection)
})
