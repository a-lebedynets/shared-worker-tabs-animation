let connections = [];
let increment = 0;
let animationId;
let isLast = false;

onconnect = function (e) {
    e.source.start();

    const port = e.ports[0];

    increment++;
    console.log(increment);


    connections.push({
        id: increment,
        connection: port,
    });

    port.postMessage({ key: 'connect', increment });

    e.source.onmessage = ({ data }) => {
        console.log(data);

        switch (data.key) {

            // case 'connect':
            //     port.postMessage({ key: 'connect', increment });
            //     break;

            case 'start':
                if (animationId) return;
                animationId = data.increment;
                connections[increment - 1].connection.postMessage({ key: 'start', increment: data.increment });
                break;

            case 'end':
                // if (animationId === data.increment) {

                console.log(increment, animationId);

                if (increment > data.increment && !isLast) {
                    animationId++;
                    connections[data.increment].connection.postMessage({ key: 'start', increment: animationId });
                } else {
                    if (animationId > 0) {
                        isLast = true;
                        animationId--;
                        if (connections[animationId])
                            connections[animationId].connection.postMessage({ key: 'end', increment: animationId });
                    } else {
                        isLast = false;
                        animationId = 1;
                        connections[data.increment].connection.postMessage({ key: 'start', increment: animationId });
                    }

                }
                // else {
                //     port.postMessage({ key: 'end', increment });
                // }
                // } else {

                // }
                // 
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
