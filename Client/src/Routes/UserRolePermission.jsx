export const Roles = {
    ADMIN: "Admin",
    USER: "User", // Default Role
};

export const roleRoutes = [
    {
        path: "/dashboard",
        component: "Dashboard",
        roles: [Roles.ADMIN, Roles.USER],
    },
    {
        path: "/about",
        component: "About",
        roles: [Roles.ADMIN, Roles.USER],
    },
    {
        path: "/task",
        component: "Task",
        roles: [Roles.ADMIN, Roles.USER],
    },
    {
        path: "/manage-task",
        component: "ManageTask",
        roles: [Roles.ADMIN],
    },
];
