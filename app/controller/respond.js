
var globalEventName;
var globalEvent;

var noOfRequests=0;

function init(event,eventName){
    globalEvent=event;
    globalEventName=eventName;
    globalEvent.on(globalEventName,respond);
}

//function to respond back
function respond(model){
    model.removeAllListeners();
    if(noOfRequests==Number.MAX_SAFE_INTEGER){
        noOfRequests=0;
    }else{
        noOfRequests+=1;
    }
//    model.res.setHeader('Content-Type', 'application/json'); 
    console.log("served "+noOfRequests+" requests")
//    model.res.send(JSON.stringify(model.info), null, 3);
    model.res.json(model.info);
}

//exports
module.exports=init;