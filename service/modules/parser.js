  'use strict'

//node dependencies
var request = require('request');

//user defined dependencies

// event names
const callbackOperation="callbackOperation"

// global event emitter
var global;

var callbackRouter;

var url;

//request headers constant
const headers     = {
                    'User-Agent':'Super Agent/0.0.1',
                    'Content-Type':'application/json'
                }

// function to instantiate
function init(globalEmitter,globalCall,callback,commonUrl){
    globalEmitter.on(globalCall,setup)
    global=globalEmitter;
    callbackRouter=callback;
    url=commonUrl;
}

function setup(model)
{
    model.once("parserService",parserFactory);
}

function parserFactory(model){
    new parserRequestFunction(model)
}

function parserRequestFunction(model){
    
    console.log("PARSER COMMON ACCESS")
    switch(model.req.body.mod){
            
        case "parser" :   firstThyrocareParserRequest(model);
                          console.log("FIRST THYROCARE REQUEST")
                          break;

        default       :   model.info="Invalid Parser Vendor Name"
                          global.emit(callbackRouter,model)
                          break;
    }
    
}


function firstThyrocareParserRequest(model){
    
     var body={
                                reportUrl:model.req.body.data.thyrocarePdfUrl,
                                reportXml:model.req.body.data.thyrocareXmlUrl 
                            }
     
     console.log(body)
     
    var options  = {            url     : url+"/pdf/parser/thyrocare/blood/"+model.req.body.data.mobile+"_"+req.body.data.leadId,
                                method  : 'POST',
                                headers : headers,
                                body    : JSON.stringify(body)
                    }

    request(options, function (error, response, body){
            if (body){
                    if(body.body=="success"){
                        model.info=JSON.parse(body);
                        console.log(JSON.parse(body)+"________")
                        secondThyrocareParserRequest(model)
    //                    global.emit(callbackRouter,model)
                    }
                    else{
                        model.info=JSON.parse(body);
                        global.emit(callbackRouter,model)
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Module PARSER"}
                    global.emit(callbackRouter,model)
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Module PARSER"}
                    global.emit(callbackRouter,model)
            }
            else{
                    model.info={error:"Error in Common Access [Module : PARSER]  : Common Access"};
                    global.emit(callbackRouter,model)
            }
        })
}


function secondThyrocareParserRequest(model){
    var options  = {            url     : url+"/report/json/"+model.req.body.data.mobile+"_"+req.body.data.leadId,
                                method  : 'POST',
                                headers : headers
                    }

    request(options, function (error, response, body){
            if (body&&response.status==200){
//                    if(body.body=="success"){
                        model.info=JSON.parse(body);
                        console.log(JSON.parse(body)+"PPPPPPPPPPPPPP")
                        global.emit(callbackRouter,model)
//                    }
//                    else{
//                        model.info=JSON.parse(body);
//                        global.emit(callbackRouter,model)
//                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Module PARSER"}
                    global.emit(callbackRouter,model)
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Module PARSER"}
                    global.emit(callbackRouter,model)
            }
            else{
                    model.info={error:"Error in Common Access [Module : PARSER]  : Common Access"};
                    global.emit(callbackRouter,model)
            }
        })
    
}

//exports
module.exports.init=init;