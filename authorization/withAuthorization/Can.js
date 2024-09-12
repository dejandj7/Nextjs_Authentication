const check = (permissions, action, data) => {
  if (!permissions || permissions.length === 0) {
    // role is not present in the rules
    return false;
  }

  if (permissions.includes(action)) {
    // static rule not provided for action
    return true;
  }

  // const dynamicPermissions = permissions.dynamic;

  // if (dynamicPermissions) {
  //   const permissionCondition = dynamicPermissions[action];
  //   if (!permissionCondition) {
  //     // dynamic rule not provided for action
  //     return false;
  //   }

  //   return permissionCondition(data);
  // }
  return false;
};

const Can = (props) =>
  check(props.permissions, props.perform, props.data)
    ? props.yes()
    : props.no();

Can.defaultProps = {
  yes: () => null,
  no: () => null,
};

export default Can;
