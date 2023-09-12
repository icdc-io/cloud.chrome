const availableRoles = ['admin', 'billing', 'member'];

const filterAndSort = list => {

  let result = [];

  if(!list || !list.length){
    return result;
  }

  result = list.map(role => {
    let order = null;
    switch (role.toLowerCase()) {
        case availableRoles[0]:
            order = 0; break;
        case availableRoles[1]:
            order = 1; break;
        case availableRoles[2]:
            order = 2; break;
        default:
            order = null; break;
    }

    return {
        key: role,
        text: `${role}`,
        value: `${role}`,
        sortOrder: order,
    }
  })
  .filter(x => x.sortOrder !== null)
  .sort((a, b) => a.sortOrder - b.sortOrder);

return result.map(r => r.key);
}

const getAvailableRoles = () => availableRoles;

export {filterAndSort, getAvailableRoles};


