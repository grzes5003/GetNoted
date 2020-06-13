const { PubSub } = require('apollo-server-express');
const {v4} = require('uuid');
const {getAsync, setAsync, keysAsync} = require('../redis-client/client');

let now = new Date();
const pubsub = new PubSub();

const CATEGORY_ADDED = 'CATEGORY_ADDED';
const TASK_ADDED = 'TASK_ADDED';

const CATEGORY_DELETED = 'CATEGORY_DELETED';
const TASK_DELETED = 'TASK_DELETED';

const TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED';

const USER = 'user:1';


const resolvers = {
    Query: {
        hello: () => {
            console.log("ROBI SIE");
            return 'no siema123'
        }
        ,
        categories: () => {
            return getAsync(USER).then(value => {
                console.log(value);
                const Categories = JSON.parse(value);
                return Categories;
            });
        }
    },
    Mutation: {
        swapCategoryPlaces: (_, s) => {
            return getAsync(USER)
                .then(value => {
                    let Categories = JSON.parse(value);
                    [Categories[s.first], Categories[s.second]] = [Categories[s.second], Categories[s.first]];
                    console.log('swaped places');
                    return setAsync(USER, JSON.stringify(Categories)).then(() => {return true});
                });
        },
        addNewCategory: (_, args) => {
            return getAsync(USER)
                .then(value => {
                    let Categories = JSON.parse(value);
                    Categories.push({
                        number: Categories.length,
                        UUID: v4(),
                        name: args.name,
                        tasks: [],
                        date: args.date,
                    });
                    console.log("new Category mutation");
                    pubsub.publish(CATEGORY_ADDED, {categoryAdded: Categories[Categories.length - 1]});
                    return setAsync(USER, JSON.stringify(Categories)).then(() => {return Categories[Categories.length - 1]});
                });
        },
        addNewTask: (_, args) => {
            return getAsync(USER)
                .then(value => {
                    let Categories = JSON.parse(value);
                    Categories.find(x => x.UUID === args.categoryUUID).tasks.push({
                        number: Categories.find(x => x.UUID === args.categoryUUID).tasks.length,
                        UUID: v4(),
                        name: args.name,
                        date: Categories.find(x => x.UUID === args.categoryUUID).date,
                        status: false, // TODO change
                    });

                    pubsub.publish(TASK_ADDED, {taskAdded: Categories.find(x => x.UUID === args.categoryUUID)});
                    return setAsync(USER, JSON.stringify(Categories)).then(() => {return Categories.find(x => x.UUID === args.categoryUUID).tasks[Categories.find(x => x.UUID === args.categoryUUID).tasks.length - 1]});
                });
        },
        deleteCategory: (_, args) => {
            return getAsync(USER)
                .then(value => {
                    let Categories = JSON.parse(value);
                    const catLen = Categories.length;
                    Categories = Categories.filter(x => args.UUID !== x.UUID);

                    console.log("cos tam ", args);

                    pubsub.publish(CATEGORY_DELETED, {categoryDeleted: args.UUID});

                    return setAsync(USER, JSON.stringify(Categories)).then(() => {
                        if (catLen === Categories.length) {
                            return false;
                        }
                        return true;
                    });
                });
        },
        deleteTask: (_, args) => {
            return getAsync(USER)
                .then(value => {
                    let Categories = JSON.parse(value);
                    let resultCat;

                    for (let cat = 0; cat < Categories.length; cat++) {
                        if (Categories[cat].tasks.filter(x => args.UUID === x.UUID).length !== 0) {
                            Categories[cat].tasks = Categories[cat].tasks.filter(x => args.UUID !== x.UUID);
                            resultCat = Categories[cat];
                        }
                    }
                    console.log("cos tam123 ", args);
                    pubsub.publish(TASK_DELETED, {taskDeleted: resultCat});

                    return setAsync(USER, JSON.stringify(Categories)).then(() => true);
                });
        },
        changeTaskStatus: (_, args) => {
            return getAsync(USER)
                .then(value => {
                    let Categories = JSON.parse(value);
                    let resultCate;

                    for (let cat = 0; cat < Categories.length; cat++) {
                        if (Categories[cat].tasks.filter(x => args.UUID === x.UUID).length !== 0) {
                            for (let t = 0; t < Categories[cat].tasks.length; t++) {
                                if (Categories[cat].tasks[t].UUID === args.UUID) {
                                    Categories[cat].tasks[t].status = !Categories[cat].tasks[t].status;
                                    resultCate = Categories[cat];
                                }
                            }
                        }
                    }

                    pubsub.publish(TASK_STATUS_CHANGED, {taskStatusChanged: resultCate});
                    return setAsync(USER, JSON.stringify(Categories)).then(() => true);
                });
        }
    },
    Subscription: {
        categoryAdded: {
            subscribe: () => (pubsub.asyncIterator([CATEGORY_ADDED])),
        },
        taskAdded: {
            subscribe: () => pubsub.asyncIterator([TASK_ADDED]),
        },
        categoryDeleted: {
            subscribe: () => pubsub.asyncIterator([CATEGORY_DELETED]),
        },
        taskDeleted: {
            subscribe: () => pubsub.asyncIterator([TASK_DELETED]),
        },
        taskStatusChanged: {
            subscribe: () => pubsub.asyncIterator([TASK_STATUS_CHANGED]),
        }
    },
};

module.exports = { resolver: resolvers, pubsub };
