const objectsArray = [
    { id: 1, name: "John", surname: "Smith" },
    { id: 2, name: "Jane", surname: "Johnson" },
    { id: 3, name: "Alex", surname: "Brown" },
    { id: 4, name: "Chris", surname: "Williams" },
    { id: 5, name: "Emily", surname: "Jones" },
    { id: 6, name: "Michael", surname: "Miller" },
    { id: 7, name: "Sarah", surname: "Davis" },
    { id: 8, name: "David", surname: "Garcia" },
    { id: 9, name: "Laura", surname: "Wilson" },
    { id: 10, name: "James", surname: "Anderson" },
    // ... continue this pattern until you have 2000 objects
    { id: 1991, name: "John", surname: "Smith" },
    { id: 1992, name: "Jane", surname: "Johnson" },
    { id: 1993, name: "Alex", surname: "Brown" },
    { id: 1994, name: "Chris", surname: "Williams" },
    { id: 1995, name: "Emily", surname: "Jones" },
    { id: 1996, name: "Michael", surname: "Miller" },
    { id: 1997, name: "Sarah", surname: "Davis" },
    { id: 1998, name: "David", surname: "Garcia" },
    { id: 1999, name: "Laura", surname: "Wilson" },
    { id: 2000, name: "James", surname: "Anderson" }
];


const hashFind = (users, id) => {
    const hash = {};
    for (let i = 0; i < users.length; i++) {
        hash[users[i].id] = users[i]
    }

    return hash[id]
}
console.time('hashFind')
const user11 = hashFind(objectsArray, 1991)
const user21 = hashFind(objectsArray, 1992)
const user31 = hashFind(objectsArray, 1993)
console.log(user11, user21, user31)

console.timeEnd('hashFind');

console.time('findOne')
const findOne = (users, id) => {
    const hash = {};
    for (let i = 0; i < users.length; i++) {
        hash[users[i].id] = users[i]
    }

    return hash[id]
}
const user1 = findOne(objectsArray, 1991)
const user2 = findOne(objectsArray, 1992)
const user3 = findOne(objectsArray, 1993)
console.log(user1, user2, user3)

console.timeEnd('findOne');
