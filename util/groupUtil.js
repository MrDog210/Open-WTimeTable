
export class Group {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}

export function getAllUniqueGroups(allGroups) {
  const groups = []

  allGroups.forEach(group => {
    const index = groups.findIndex((g) => g.id === Number(group.id))

    if (index === -1) // if there is no matching group already in our unique groups, we add this group
      groups.push(new Group(Number(group.id), group.name))
  });

  return groups
}