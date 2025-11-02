
let taxis = [
    { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 }
];


let requests = [ 
    { reqId: 1, position: 10, duration: 3, time: 0 },
    { reqId: 2, position: 3, duration: 4, time: 2 },
    { reqId: 3, position: 18, duration: 2, time: 4 },
    { reqId: 4, position: 7, duration: 5, time: 5 }
];

let totalRides = 0;
let waitingQueue = [];
let currentTime = 0;

// Trouver le taxi disponible le plus proche
function findNearestTaxi(request) {
    let availableTaxis = taxis.filter(t => t.available);
    if (availableTaxis.length === 0) return null;

    let a9rabtaxi = availableTaxis[0];
    let minDistance = Math.abs(a9rabtaxi.position - request.position);

    for (let taxi of availableTaxis) {
        let distance = Math.abs(taxi.position - request.position);
        if (distance < minDistance) {
            a9rabtaxi = taxi;
            minDistance = distance;
        }
    }

    return a9rabtaxi;
}

// Attribuer un taxi à une demande
function assignTaxi(taxi, request) {
    taxi.available = false;
    taxi.timeRemaining = request.duration;
    taxi.totalRides += 1;
    taxi.destination = request.position;

    console.log(`Minute ${currentTime}: Request ${request.reqId} at position ${request.position} - Taxi ${taxi.id} assigned (distance: ${Math.abs(taxi.position - request.position)})`);
    totalRides++;
}

// Mettre à jour l'état des taxis
function updateTaxis() {
    taxis.forEach(taxi => {
        if (!taxi.available) {
            taxi.timeRemaining--;
            if (taxi.timeRemaining === 0) {
                taxi.available = true;
                taxi.position = taxi.destination;
                delete taxi.destination;

                if (waitingQueue.length > 0) {
                    let nextRequest = waitingQueue.shift();
                    assignTaxi(taxi, nextRequest);
                }
            }
        }
    });
}

// Simulation minute par minute
function simulateMinute(currentTime) {
    let currentRequests = requests.filter(r => r.time === currentTime);
    currentRequests.forEach(request => {
        let taxi = findNearestTaxi(request);
        if (taxi) {
            assignTaxi(taxi, request);
        } else {
            console.log(`Minute ${currentTime}: Request ${request.reqId} at position ${request.position} - No taxi available, added to queue`);
            waitingQueue.push(request);
        }
    });

    updateTaxis();
}

// Simulation complète sans boucle while
for (currentTime = 0; currentTime <= 10; currentTime+=1) {
    simulateMinute(currentTime);
}

// Rapport final
console.log('--- Final Report ---');
taxis.forEach(taxi => {
    console.log(`Taxi ${taxi.id}: ${taxi.totalRides} rides, position ${taxi.position}`);
});
console.log(`Total rides: ${totalRides}`);
