export const constants = {
    CTX_CATEGORY: 'category',
    CTX_TASK: 'task',
    HOST_ADDRESS: process.env.NODE_ENV === 'development' ? 'http://192.168.99.100:4000' : 'https://get-noted-app.herokuapp.com',
    HOST_ADDRESS_WS: process.env.NODE_ENV === 'development' ? 'ws://192.168.99.100:4000' : 'wss://get-noted-app.herokuapp.com',
};

