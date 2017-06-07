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
    
    console.log(model.req.body.data)
    
     var body={
                                reportUrl:model.req.body.data.pdfUrl,
                                reportXml:model.req.body.data.xmlUrl 
                            }
     
     console.log(body)
     
    var options  = {            url     : url+"/pdf/parser/thyrocare/blood/"+model.req.body.data.mobile+"_"+model.req.body.data.thyrocareLeadId,
                                method  : 'POST',
                                headers : headers,
                                body    : JSON.stringify(body)
                    }

    request(options, function (error, response, body){
            if (body){
                
                            try{
                                body=JSON.parse(body);
                            }
                            catch(err){
                                console.log(err)
                            }
                
                    if(body.body=="Success"){
                        model.info=body;
                        console.log(body+"________")
                        secondThyrocareParserRequest(model)
    //                    global.emit(callbackRouter,model)
                    }
                    else{
                        model.info=body;
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
    var options  = {            url     : url+"/report/json/"+model.req.body.data.mobile+"_"+model.req.body.data.thyrocareLeadId,
                                method  : 'POST',
                                headers : headers
                    }

    request(options, function (error, response, body){
        console.log(response.status)
        console.log(JSON.parse(body))
            if (body&&response.status==200){
                        model.info=JSON.parse(body);
                        console.log(JSON.parse(body)+"PPPPPPPPPPPPPP")
                        global.emit(callbackRouter,model)
//                    
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