// // Liste des taxis (objets simples)
// let taxis = [
//     { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
//     { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
//     { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 }
// ];

// // Liste des demandes (objets simples)
// let requests = [
//     { reqId: 1, position: 10, duration: 3, time: 0 },
//     { reqId: 2, position: 3, duration: 4, time: 2 },
//     { reqId: 3, position: 18, duration: 2, time: 4 },
//     { reqId: 4, position: 7, duration: 5, time: 5 }
// ];

// // File d'attente pour les demandes en attente
// let waitingQueue = [];

// // Fonction pour trouver le taxi le plus proche disponible
// function findClosestAvailableTaxi(requestPosition) {
//     let availableTaxis = taxis.filter(taxi => taxi.available); // Filtrer les taxis libres
//     if (availableTaxis.length === 0) {
//         return null; // Aucun taxi libre
//     }
//     // Trouver celui avec la plus petite distance
//     let closest = availableTaxis[0];
//     let minDistance = Math.abs(closest.position - requestPosition);
//     for (let i = 1; i < availableTaxis.length; i++) {
//         let distance = Math.abs(availableTaxis[i].position - requestPosition);
//         if (distance < minDistance) {
//             minDistance = distance;
//             closest = availableTaxis[i];
//         }
//     }
//     return closest;
// }

// // Simulation minute par minute
// let currentTime = 0;
// let maxTime = 20; // Temps max pour arrêter la simulation (ajuste si besoin)
// let processedRequests = 0;

// while (currentTime <= maxTime) {
//     // Traiter les nouvelles demandes à ce temps
//     let newRequests = requests.filter(req => req.time === currentTime);
//     for (let req of newRequests) {
//         let taxi = findClosestAvailableTaxi(req.position);
//         if (taxi) {
//             // Assigner le taxi
//             let distance = Math.abs(taxi.position - req.position);
//             let totalTime = distance + req.duration;
//             taxi.available = false;
//             taxi.timeRemaining = totalTime;
//             taxi.totalRides += 1;
//             taxi.position = req.position; // Nouveau position après trajet
//             processedRequests += 1;
//             console.log(`Minute ${currentTime}: Taxi ${taxi.id} assigné à demande ${req.reqId} (distance: ${distance})`);
//         } else {
//             // Mettre en attente
//             waitingQueue.push(req);
//             console.log(`Minute ${currentTime}: Pas de taxi pour demande ${req.reqId}, en attente`);
//         }
//     }
    
//     // Mettre à jour les taxis (diminuer temps restant)
//     for (let taxi of taxis) {
//         if (taxi.timeRemaining > 0) {
//             taxi.timeRemaining -= 1;
//             if (taxi.timeRemaining === 0) {
//                 taxi.available = true;
//                 console.log(`Minute ${currentTime}: Taxi ${taxi.id} est maintenant libre`);
//                 // Prendre une demande en attente si possible
//                 if (waitingQueue.length > 0) {
//                     let req = waitingQueue.shift(); // Prendre la première en attente
//                     // Réassigner immédiatement (comme une nouvelle demande)
//                     let newTaxi = findClosestAvailableTaxi(req.position);
//                     if (newTaxi) {
//                         let distance = Math.abs(newTaxi.position - req.position);
//                         let totalTime = distance + req.duration;
//                         newTaxi.available = false;
//                         newTaxi.timeRemaining = totalTime;
//                         newTaxi.totalRides += 1;
//                         newTaxi.position = req.position;
//                         processedRequests += 1;
//                         console.log(`Minute ${currentTime}: Taxi ${newTaxi.id} prend demande ${req.reqId} de la file (distance: ${distance})`);
//                     }
//                 }
//             }
//         }
//     }
    
//     currentTime += 1; // Passer à la minute suivante
// }

// // Rapport final
// console.log("\n--- Rapport Final ---");
// console.log(`Temps total simulé: ${currentTime - 1} minutes`);
// console.log(`Demandes traitées: ${processedRequests}`);
// for (let taxi of taxis) {
//     console.log(`Taxi ${taxi.id}: ${taxi.totalRides} trajets, Position finale: ${taxi.position}`);
// }
// Initialisation des taxis
let taxis = [
  { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 }
];

// Liste des demandes
let requests = [
  { reqId: 1, position: 10, duration: 3, time: 0 },
  { reqId: 2, position: 3, duration: 4, time: 2 },
  { reqId: 3, position: 18, duration: 2, time: 4 },
  { reqId: 4, position: 7, duration: 5, time: 5 }
];

let waitingQueue = [];
let currentTime = 0;
let totalRides = 0;

function findAvailableTaxi(request) {
  let availableTaxis = taxis.filter(t => t.available);
  if (availableTaxis.length === 0) return null;
  return availableTaxis.reduce((closest, taxi) => {
    let dist = Math.abs(taxi.position - request.position);
    let closestDist = Math.abs(closest.position - request.position);
    return dist < closestDist ? taxi : closest;
  });
}

function assignTaxi(taxi, request) {
  taxi.available = false;
  taxi.timeRemaining = request.duration;
  taxi.totalRides += 1;
  taxi.destination = request.position;
  console.log(`Minute ${currentTime}: Request ${request.reqId} at position ${request.position} - Taxi ${taxi.id} assigned (distance: ${Math.abs(taxi.position - request.position)})`);
  totalRides++;
}

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
while (requests.length > 0 || waitingQueue.length > 0 || taxis.some(t => !t.available)) {
  // Traiter les demandes arrivant à cette minute
  requests.filter(r => r.time === currentTime).forEach(request => {
    let taxi = findAvailableTaxi(request);
    if (taxi) {
      assignTaxi(taxi, request);
    } else {
      console.log(`Minute ${currentTime}: Request ${request.reqId} at position ${request.position} - all taxis busy - added to queue.`);
      waitingQueue.push(request);
    }
  });

  updateTaxis();
  currentTime++;
}

// Rapport final
console.log(`\nMinute ${currentTime}: All rides completed.\n--- Final Report ---`);
taxis.forEach(taxi => {
  console.log(`Taxi ${taxi.id}: ${taxi.totalRides} rides, position ${taxi.position}`);
});
console.log(`Total rides: ${totalRides}`);
