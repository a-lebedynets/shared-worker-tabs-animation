let connections = [];
let increment = 0;

onconnect = function (e) {
    e.source.start();

    const port = e.ports[0];

    increment++;
    console.log(increment);


    connections.push({
        id: increment,
        connection: port,
    });

    e.source.onmessage = ({ data: message }) => {
        console.log(message);

        switch (message) {
            case 'is-first':
                port.postMessage({ key: 'is-first', value: increment === 1 });
                break;

            case 'end':
                port.postMessage({ key: 'end', value: increment === 1 });
                break;

            default:
                break;
        }
        // console.log(message);
        // if (increment === 1) {
        //     port.postMessage();
        // } else port.postMessage();
    };
}
