/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load event's controller */
const eventController = require(`../controllers/event.controller`)

/** load middleware for authentication and role validation */
const { authorize } = require(`../middlewares/auth-validation`)
const { IsUser, IsAdmin } = require(`../middlewares/role-validation`)

/** create route to get data with method "GET" */
app.get("/", authorize, eventController.getAllEvent)

/** create route to find event using method "GET" with search prefix */
app.get("/search/:key", authorize, eventController.findEvent)

/** create route to add new event using method "POST" (Admin Only) */
app.post("/", authorize, IsAdmin, eventController.addEvent)

/** create route to update event 
 * using method "PUT" and define parameter for "id" (Admin Only) */
app.put("/:id", authorize, IsAdmin, eventController.updateEvent)

/** create route to delete event 
 * using method "DELETE" and define parameter for "id" (Admin Only) */
app.delete("/:id", authorize, IsAdmin, eventController.deleteEvent)

/** export app in order to load in another file */
module.exports = app