let connections = [];
let pageNumber = 0;
let animationId;
let isLast = false;

onconnect = function (e) {
    e.source.start();
    const port = e.ports[0];

    pageNumber++;
    connections.push({
        id: pageNumber,
        connection: port,
    });

    port.postMessage({ key: 'connect', pageNumber });

    e.source.onmessage = ({ data }) => {

        switch (data.key) {

            case 'start':
                if (animationId) return;
                animationId = data.pageNumber;
                connections[pageNumber - 1]
                    .connection.postMessage({ key: 'start', pageNumber: data.pageNumber });
                break;

            case 'end':
                if (pageNumber > data.pageNumber && !isLast) {
                    animationId++;
                    connections[data.pageNumber]
                        .connection.postMessage({ key: 'start', pageNumber: animationId });
                } else {
                    if (animationId) {
                        isLast = true;
                        animationId--;
                        if (connections[animationId])
                            connections[animationId]
                                .connection.postMessage({ key: 'end', pageNumber: animationId });
                    } else {
                        isLast = false;
                        animationId = 1;
                        connections[data.pageNumber]
                            .connection.postMessage({ key: 'start', pageNumber: animationId });
                    }
                }
                break;

            default:
                break;
        }
    };
}
