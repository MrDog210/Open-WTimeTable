
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

export function getGroupsIntersection(groups1, groups2) { // returns all the common groups between two arrays
  const commonGroups = []
  console.log('g1' + groups1)
  console.log('g2' + groups2)

  groups1.forEach(g1 => {
    groups2.forEach(g2 => {
      if(g2.id == g1.id)
        commonGroups.push(g1)
    })
  })
  
  return commonGroups
}