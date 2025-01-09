import express from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from "../controllers/TaskController.js";

const route = express.Router();

route.post("/create_task", createTask);
route.get("/get_tasks", getAllTasks);
route.get("/get_task_details/:id", getTaskById);
route.get("/delete_task/:id", deleteTask);
route.get("/update_task/:id", updateTask);

export default route;
