
const PermissionHandler = {
    hasPermission: (permissions: string[], permission: string) => {
        return permissions.includes(permission);
    }
}

export default PermissionHandler;