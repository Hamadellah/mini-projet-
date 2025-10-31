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
let totalRides=0
let waitingQueue=[]
let currentTime = 0;

function taxisi(request){
    let valiabletaxi= taxis.filter(t=>t.available)
    if (valiabletaxi.length===0)return null;

    let a9rabtaxi=valiabletaxi[0]
    let minidistance=Math.abs(a9rabtaxi.position-request.position)

    for (let i =0 ; i<valiabletaxi.length;i++){
        let taxi = valiabletaxi[i]
        let masafa = Math.abs (taxi.position-request.position)

        if (masafa<minidistance){
            a9rabtaxi=taxi
            masafa=minidistance
        }




    }

return a9rabtaxi

}

function tragettaxi(taxi,request){
    taxi.available=false
    taxi.timeRemaining=request.duration
    taxi.totalRides=+1
    taxi.distination=request.position
      console.log(`Minute ${currentTime}: Request ${request.reqId} at position ${request.position} - Taxi ${taxi.id} assigned (distance: ${Math.abs(taxi.position - request.position)})`);
    totalRides++

}
function updattaxi(){
    taxis.forEach(taxi=>{
       if(!taxi.available) {
        taxi.timeRemaining--;
        if(taxi.timeRemaining===0){
            taxi.available=true
           taxi.position=taxi.distination 
           delete taxi.distination
           if(waitingQueue.length>0){
            let nextRequest=waitingQueue.shift()
            tragettaxi(taxi,nextRequest)
           }

        }
       }
    })
}
while (requests.length > 0 || waitingQueue.length > 0 || taxis.some(t => !t.available)) {
  requests.filter(r => r.time === currentTime).forEach(request => {
    let taxi = taxisi(request); 
    if (taxi) {
      tragettaxi(taxi, request); 
    } else {
      console.log(`Minute ${currentTime}: Request ${request.reqId} at position ${request.position} - all taxis busy - added to queue.`);
      waitingQueue.push(request);
    }
  });

  updattaxi();
  currentTime++; 
}
 

console.log(`\nMinute ${currentTime}: All rides completed.\n--- Final Report ---`);
taxis.forEach(taxi => {
  console.log(`Taxi ${taxi.id}: ${taxi.totalRides} rides, position ${taxi.position}`);
});
console.log(`Total rides: ${totalRides}`);










