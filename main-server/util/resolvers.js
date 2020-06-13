let now = new Date();
const pubsub = new PubSub();

const CATEGORY_ADDED = 'CATEGORY_ADDED';
const TASK_ADDED = 'TASK_ADDED';

const CATEGORY_DELETED = 'CATEGORY_DELETED';
const TASK_DELETED = 'TASK_DELETED';

const TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED';


const Tasks1 = ['WWW', 'JPWP', 'UST', 'TR', 'CPS'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        date: now.setDate(now.getDate() + index * 7),
        status: Math.random() >= 0.5
    }
));

const Tasks2 = ['Praca1', 'Praca2', 'CV'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        date: now.setDate(now.getDate() + index * 7),
        status: Math.random() >= 0.5
    }
));

const Tasks3 = ['Morskie', 'Gory'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        date: now.setDate(now.getDate() + index * 7),
        status: Math.random() >= 0.5
    }
));

const Tasks = [Tasks1, Tasks2, Tasks3];

export let Categories = ['Semestr Letni', 'Staż', 'Wakacje 2020'].map((str, index) => (
    {
        number: index,
        UUID: v4(),
        name: str,
        tasks: Tasks[index],
        date: now.setDate(now.getDate() + index * 7),
    }
));


export const resolvers = {
    Query: {
        categories: () => {
            return Categories
        }
    },
    Mutation: {
        swapCategoryPlaces: (_, s) => {
            [Categories[s.first], Categories[s.second]] = [Categories[s.second], Categories[s.first]];

            // let temp = tmpList[s.first];
            // tmpList[s.first] = tmpList[s.second];
            // tmpList[s.second] = temp;

            console.log('swaped places');
            //console.log(tmpList);
            return true;
        },
        addNewCategory: (_, args) => {
            Categories.push({
                number: Categories.length,
                UUID: v4(),
                name: args.name,
                tasks: [],
                date: args.date,
            });

            console.log("new Category mutation");
            pubsub.publish(CATEGORY_ADDED, {categoryAdded: Categories[Categories.length - 1]});
            return Categories[Categories.length - 1];
        },
        addNewTask: (_, args) => {
            Categories.find(x => x.UUID === args.categoryUUID).tasks.push({
                number: Categories.find(x => x.UUID === args.categoryUUID).tasks.length,
                UUID: v4(),
                name: args.name,
                date: Categories.find(x => x.UUID === args.categoryUUID).date,
                status: false, // TODO change
            });

            pubsub.publish(TASK_ADDED, {taskAdded: Categories.find(x => x.UUID === args.categoryUUID)});
            return Categories.find(x => x.UUID === args.categoryUUID).tasks[Categories.find(x => x.UUID === args.categoryUUID).tasks.length - 1];
        },
        deleteCategory: (_, args) => {
            const catLen = Categories.length;
            Categories = Categories.filter(x => args.UUID !== x.UUID);

            console.log("cos tam ", args);

            pubsub.publish(CATEGORY_DELETED, {categoryDeleted: args.UUID});

            if(catLen === Categories.length) {
                return false;
            }
            return true;
        },
        deleteTask: (_, args) => {

            let resultCat;

            for(let cat=0; cat<Categories.length; cat++){
                if(Categories[cat].tasks.filter(x => args.UUID === x.UUID).length !== 0){
                    Categories[cat].tasks = Categories[cat].tasks.filter(x => args.UUID !== x.UUID);
                    resultCat = Categories[cat];
                }
            }

            console.log("cos tam123 ", args);

            pubsub.publish(TASK_DELETED, {taskDeleted: resultCat});

            return true;
        },
        changeTaskStatus: (_, args) => {

            let resultCate;

            for(let cat=0; cat<Categories.length; cat++){
                if(Categories[cat].tasks.filter(x => args.UUID === x.UUID).length !== 0){
                    for(let t=0; t<Categories[cat].tasks.length; t++) {
                        if( Categories[cat].tasks[t].UUID === args.UUID){
                            Categories[cat].tasks[t].status = !Categories[cat].tasks[t].status;
                            resultCate = Categories[cat];
                        }
                    }
                }
            }

            pubsub.publish(TASK_STATUS_CHANGED, {taskStatusChanged: resultCate});

            return true;
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
