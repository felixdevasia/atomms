var VZ_Chat = (function () {
    // Internal references
    var out = {},
        tChatTag,
        debugMode,
        legacyMode,
        chatVars,
        // Each var will be of format: 
        //  {
        //      'name'  : 'aName', 
        //      'value' : 'aValue', 
        //      'scope' : ["page"|"session"], 
        //      'mobile': [true : false]
        //  }
        dl,
        fnQueue = [],
        console = window.console,
        isReady = false;
    
    // Private functions
    function disableLPChat(){
        if (typeof _LP_CFG_ !== 'undefined') { // Disable LP mobile
            _LP_CFG_.options = { 'chatDisabled' : true };
        }
    }

    function bindDL(){
        if (typeof vzwDL === 'undefined') {
            console.log('VZ_Chat Init Warning -> vzwDL not found');
            return;
        }

        dl = vzwDL;
        dl.page = dl.page || {};
        dl.page.chat = dl.page.chat || [];
        chatVars = dl.page.chat;
        isReady = true;
    }
    
    function downloadChatTag() {
        if (legacyMode) {

            disableLPChat();
        }

        jQuery.ajax({
            dataType: 'script',
            cache: true,
            url: tChatTag.src
        })
        .done(function (script, status) {
            if (debugMode) {
                console.log('Init - Tag Loaded -> { ID: ', tChatTag.id, '}');
            }
        })
        .fail(function (jqxhr, settings, exception) {
            if (debugMode) {
                console.error('Init - Tag Load Error -> { ID: ', tChatTag.id,
                    ', HTTP Status: ', jqxhr.status, '}');
            }
        });
    }
    
    function addVar(name, value, scope, mobile) {
        var newVar;

        if (!chatVars) {
            throw getException('DataLayerUndefinedException', 'Data Layer is Undefined');
        }

        newVar = {
            'name'      : name,
            'value'     : value,    
            'scope'     : scope,
            'mobile'    : mobile,
            'toString'  : function () {
                return '{ name: '+ name +
                ', value: ' + value + ', scope: '+ scope +
                ', mobile: ' + mobile + ' }';
            }
        };

        if (typeof name !== 'string' ||
            typeof value === 'undefined' ||
            (typeof scope !== 'string' || (scope !== 'page' && scope !== 'session')) ||
            typeof mobile !== 'boolean') {

            throw getException('InvalidVariableException',
                'Invalid variable format: ' + newVar.toString());
        }

        if (debugMode) {
            console.log('Adding var: ' + newVar.toString());
        }

        chatVars[chatVars.length] = newVar;
    }

    // Class utilities
    function isEventSupported(eventName) {
        var TAGNAMES = 
        {
            'select':'input','change':'input',
            'submit':'form','reset':'form',
            'error':'img','load':'img','abort':'img'
        };

        var el = document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        var isSupported = (eventName in el);
        
        if (!isSupported) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] == 'function';
        }

        el = null;
        return isSupported;
    }

    function getException(name, msg) {
        // TODO: Use new Error();

        return {
            'name'      : name,
            'msg'       : msg,
            'toString'  : function () {return this.name + ': ' + this.msg;} 
        };
    }

    function initVars (scrubber, builder) {
        try {
            bindDL();

            while (fnQueue.length > 0) {
                fnQueue.pop()();
            }

            if (scrubber) {
                scrubber = new scrubber(VZ_Chat, dl);
                console.log('Data scrubbing with: ' + scrubber.toString());

                scrubber.scrub();
            } else {
                console.log('Warning! -> Data scrubber is not defined');
            }
            
            if (builder) {
                builder = new builder(VZ_Chat, dl);
                console.log('Data building with: ' + builder.toString());

                builder.build();
            } else {
                console.log('Warning! -> Data builder is not defined');
            }

        } catch (err) {
            // If the DL is not found we are not going to be able
            // to provide most of the user/conversion data.
            // However, we are capturing the exception so that
            // customers don't lose the ability to chat.
            console.log('Critical [and ignored] error on init -> ' + err);
        }
    }

    // Public methods
    function init (chatTagDef, options) {
        // IE Console Polyfill
        if (typeof console === 'undefined') {
            window.console = {};
            console.log = function () {};
            console.error = function () {};
        }

        // String.trim() Polyfill
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            };
        }

        if (isEventSupported('DOMContentLoaded')) {
            console.error('Browser is not supported! IE9+ is required');
            return;
        }

        tChatTag    = chatTagDef; 
        options     = options || {};
        debugMode   = options.debugMode || false;
        legacyMode  = options.legacyMode || true;
        
        if (document.readyState === 'interactive' || document.readyState === 'complete') { // Ensighten import fallbacks
            initVars(options.scrubber, options.builder);
            downloadChatTag();
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                initVars(options.scrubber, options.builder);
                downloadChatTag();
            });
        }   
    }

    function setVar() {
        var tName, tValue, tScope, tMobile;

        if (arguments.length >= 2) {

            // Single variable pass setVar(name, value, scope, mobile).  
            // Mobile defaults to true, and scope defaults to 'page'.
            tName   = arguments[0],
            tValue  = arguments[1],
            tScope  = arguments[2] || 'page',
            tMobile = (typeof arguments[3] == 'undefined') ? true : arguments[3];

            try {
                addVar(tName, tValue, tScope, tMobile); 
            } catch (err) {
                if (debugMode) {
                    console.log('setVar error ->' + err);
                }

                if (err.name == 'DataLayerUndefinedException' && !isReady) {
                    fnQueue.push(function () {
                        setVar(tName, tValue, tScope, tMobile);
                    });
                }
            }

        } else if (arguments.length == 1) {
            // TODO: Variables passed as an object
            throw getException('OperationNotSupported', 
                    'This operation is not supported');
        } else {
            throw getException('InvalidArgument', 
                'Argument count is invalid');
        }
    }

    function getChatTag () {
        return tChatTag;
    }

    function isDebugModeOn () {
        return debugMode;
    }

    // External API Definitions
    out.getChatTag      = getChatTag;
    out.init            = init;
    out.setVar          = setVar;
    out.getException    = getException;
    out.isDebugModeOn   = isDebugModeOn;

    return out;
})();

VZ_Chat.LPMobileDataScrubber = function (that, dl) {
    var name = 'LPMobileDataScrubber';

    //Init
    if (!dl) {
        throw that.getException('InvalidParamException', 'Data layer is undefined');
    }

    function isValidVar (name) {
        return name === 'Source_mobile_ind' ||
            name === 'mobile_visit' ||
            name === 'tablet_visit';
    }
    
    function scrubLPData () {
        if (typeof arrLPvars !== 'undefined') {
            for(var i = 0; i < arrLPvars.length; i++){
                if (isValidVar(arrLPvars[i].name)) {
                    that.setVar(arrLPvars[i].name, arrLPvars[i].value);
                }
            }

        } else if (typeof App !== 'undefined' && 
            typeof App.vars !== 'undefined' &&
            typeof App.vars.livePerson !== 'undefined') {
            
            for (var key in App.vars.livePerson) {
                if (isValidVar(key)) {
                    that.setVar(key, App.vars.livePerson[key]);
                }
            }
        } else {
            if (that.isDebugModeOn()) {
                console.log('Warning! Found no data structure to scrub');
                return;
            }
        }
    }

    // TODO: Promote this to parent prototype
    function scrubVisitorAttr () {
        if (dl.page) {
            that.setVar('Section', dl.page.section2);
            that.setVar('Market', dl.page.area);
            that.setVar('language', dl.page.language);
            that.setVar('channel', dl.page.channel);
        }

        if (dl.authentication && dl.authentication.accountNumber) {
            that.setVar('LoginFlag', '1');
            that.setVar('Role', dl.authentication.userRole);
            that.setVar('AccountNumber', dl.authentication.accountNumber);
            that.setVar('MobileNumber', dl.authentication.mdn);
            that.setVar('custType', dl.authentication.custType);
            
            // The below three attributes are unavailable
            that.setVar('GreetingName', dl.authentication.greetingName);
            that.setVar('collectionsInd', dl.authentication.collectionsInd);
            that.setVar('prepayInd', dl.authentication.prepayInd);
        }
    }

    // TODO: Add this to parent prototype
    this.toString = function () {
        return name;
    };

    this.scrub = function () {
        scrubLPData();
        scrubVisitorAttr();
    };
};

VZ_Chat.TCMobileDataBuilder = function (that, dl) {
    var name = 'TCMobileDataBuilder';

    //Init
    if (!dl) {
        throw that.getException('InvalidParamException', 'Data layer is undefined');
    }

    function buildVisitorAttr () {
        var tVar,
            chatVars = dl.page.chat,
            isMobile = typeof dl.page.platform !== 'undefined' && 
                (dl.page.platform.toLowerCase() === 'mobile' || dl.page.platform.toLowerCase() === 'tablet');

        inqCustData = {};

        for (var i = 0; i < chatVars.length; i++) {
            tVar = chatVars[i];

            if ((isMobile && tVar.mobile) || !isMobile) {
                inqCustData[tVar.name] = tVar.value.toString();
            }
        }

        if (that.isDebugModeOn()) {
            console.log('TCMobileDataBuilder visitor attributes ' +
                'build complete for: inqCustData');
        }

        that.vendorData = that.vendorData || {}; 
        that.vendorData.inqCustData = inqCustData; 
    }
    
    function buildConvVars () {
        if (dl.purchase) {
            var aQty, 
                aPrice,
                aProductType,
                anItem,
                totals;

            // TODO: Move this to the top of the file 
            inqClientOrderNum       = dl.purchase.orderNumber;
            inqSalesProducts        = [];
            inqSalesQuantities      = [];
            inqSalesPrices          = [];
            inqSalesProductTypes    = [];

            totals = {
                'purchaseType'  : dl.purchase.orderType,
                'puOrderTotal'  : 0,
                'pOrderTotal'   : 0,
                'aOrderTotal'   : 0,
                'auOrderTotal'  : 0
            };

            for (var i = 0; i < dl.purchase.items.length; i++) {
                anItem = dl.purchase.items[i];

                if (!anItem.productId) {
                    continue;
                }

                aQty            = anItem.quantity || 1;
                aPrice          = anItem.price || 0;
                aProductType    = anItem.category || '';

                switch (anItem.category.toLowerCase()) {
                    case 'device' :
                        totals.puOrderTotal += anItem.quantity;
                        totals.pOrderTotal += Math.round(anItem.price * anItem.quantity * 100) / 100;
                        break;
                    case 'accessories' :
                        totals.auOrderTotal += anItem.quantity;
                        totals.aOrderTotal += Math.round(anItem.price * anItem.quantity * 100) / 100;
                        break; 
                }

                inqSalesProducts.push(getProductString(anItem, dl.purchase.contractType));
                inqSalesQuantities.push(aQty);
                inqSalesPrices.push(aPrice);
                inqSalesProductTypes.push(aProductType);

            }

            inqOtherInfo = getOtherInfoString(totals);

            if (that.isDebugModeOn()) {
                console.log('TCMobileDataBuilder conversion vars build complete for: inqClientOrderNum, ' +
                    'inqSalesProductTypes, inqSalesProducts, inqSalesQuantities, inqSalesPrices, inqOtherInfo');
            }

            that.vendorData = that.vendorData || {};
            that.vendorData.inqClientOrderNum       = inqClientOrderNum;
            that.vendorData.inqSalesProductTypes    = inqSalesProductTypes;
            that.vendorData.inqSalesProducts        = inqSalesProducts;
            that.vendorData.inqSalesQuantities      = inqSalesQuantities;
            that.vendorData.inqSalesPrices          = inqSalesPrices;
            that.vendorData.inqOtherInfo            = inqOtherInfo;
        }


    }

    function getProductString (item, term) {
        //TODO: Add inq* sample data
        //TODO: Add vzwDL samples

        var out     = '',
            aCat    = item.category || '',
            aName   = item.name || '',
            aTerm   = term && item.category !== 'accessories' ? term : '',
            anID    = item.productId;

        out += 'CAT:' + aCat.replace('~', '').trim() + '~';
        out += 'NAM:' + aName.replace('~', '').trim() + '~';
        out += 'TERM:' + aTerm.replace('~', '').trim() + '~';
        out += 'ID:' + anID.replace('~', '').trim();

        return out;
    }

    function getOtherInfoString (totals) {
        var out = '';

        out += 'ORT:' + totals.purchaseType.replace('~', '').trim() + '~';
        out += 'PUOT:' + totals.puOrderTotal + '~';
        out += 'POT:' + totals.pOrderTotal + '~';
        out += 'AUOT:' + totals.auOrderTotal + '~';
        out += 'AOT:' + totals.aOrderTotal; 

        return out;
    }

    // TODO: Add this to parent prototype
    this.toString = function () {
        return name;
    };

    this.build = function () {
        buildVisitorAttr();
        buildConvVars();
    };
};

// TODO: Add LP Data Builder