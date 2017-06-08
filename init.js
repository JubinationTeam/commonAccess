'use strict'

//data access
//var genericDataAccess=require('jubi-mongoose-data-access');

//controller
var controllerInit=require('jubi-express-controller').init;
var controllerResponseInit=require('./controller/respond.js');

//services
var commonAccessService=require('./service/commonAccessService.js').init;
var vendorManager=require('./service/modules/vendor/vendorManager.js').init;

//module services
var guardService=require('./service/modules/guard.js').init
var awsService=require('./service/modules/aws.js').init
var userAccountService=require('./service/modules/userAccount.js').init
var parserService=require('./service/modules/parser.js').init
var thyrocareService=require('./service/modules/vendor/thyrocare/thyrocareServices.js').init

//global event emitter
const EventEmitter = require('events');
class GlobalEmitter extends EventEmitter {   }
const globalEmitter = new GlobalEmitter();
globalEmitter.setMaxListeners(3);

//url variables
const postUrlDef='/:type';
const getUrlDef='/';

//valid url's
var validRequestEntities={
                            "post":["commonAccess/"],
                            "get":[]
                         };

const globalDataAccessCall='dataAccessCall';

//variables required by controller init function
var routerInitModel={
        'globalEmitter':globalEmitter,
        'postUrlDef':postUrlDef,
        'getUrlDef':getUrlDef,
        'validRequestEntities':validRequestEntities,
        'callbackName':'notToBeUsed',//not to be used in this app
        'nextCall':'service'
    };
//variables required by data access init function
var dataAccessInitModel={
        'globalEmitter':globalEmitter,
        'callName':globalDataAccessCall
    };

const urls={
    'guard':'https://mysterious-garden-59970.herokuapp.com',
    'aws':'http://35.154.233.231:8001/aws',
    'parser':'http://35.154.233.231/Parser',
    'vendor':{
        'thyrocare':'https://shrouded-everglades-23668.herokuapp.com'
    },
//    'userAccount':'https://ancient-shore-46511.herokuapp.com'
    'userAccount':'https://localhost:443/'
}

//instantiating Handler,Service layer and Data Access layer
function init(){
    controllerInit(routerInitModel);
    controllerResponseInit(globalEmitter,"callbackRouter")
    commonAccessService(globalEmitter,'commonAccess','callbackRouter');
    vendorManager(globalEmitter,'vendor','callbackRouter');
    guardService(globalEmitter,'guard','callbackRouter',urls.guard);
    awsService(globalEmitter,'aws','callbackRouter',urls.aws);
    parserService(globalEmitter,'parser','callbackRouter',urls.parser)
    thyrocareService(globalEmitter,'thyrocare','callbackRouter',urls.vendor.thyrocare)
    userAccountService(globalEmitter,'userAccount','callbackRouter',urls.userAccount)   
}

//exports
module.exports.init=init;