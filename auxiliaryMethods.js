module.exports = {
    contains: contains,
    removeDuplicates: removeDuplicates,
    uniqueArray: uniqueArray,
    isEmptyOrSpacesOrUndefined: isEmptyOrSpacesOrUndefined,
    createMap: createMap,
    howManyTimesTheValueAppears: howManyTimesTheValueAppears,
    hasChanged: hasChanged,
    monthDays: monthDays,
    compareObjs: compareObjs,
    compareArrays: compareArrays,
    compareDates: compareDates,
    createMapKeyValue: createMapKeyValue,
    camelCase: camelCase,
    fieldChanged: fieldChanged,
    validateObjectItIsFilled: validateObjectItIsFilled,
    flat: flat,
    flattenDeep: flattenDeep,
    toUpperCase: toUpperCase,
    toLocaleLowerCase: toLocaleLowerCase,
    parseToArray: parseToArray,
    deepCopy:deepCopy,
    removeMask: removeMask,
    singularOrPlural: singularOrPlural,
    prepareSingularOrPlural: prepareSingularOrPlural,
    inQuotes: inQuotes,
    makeString:makeString,
    firstLetterToUpperCase: firstLetterToUpperCase,
    objectEntries: objectEntries,
    isCEPValid: isCEPValid,
    isObject: isObject,
    isNotEmptyObject: isNotEmptyObject,
    padStart: padStart,
    padEnd: padEnd,
    escapeHTML: escapeHTML,
    getErrorsStringFromException: getErrorsStringFromException,
    removeSpecialChars: removeSpecialChars,
    addMinutes: addMinutes
};


function contains(array, value) {
    var index = -1;
    var length = array.length;
    while (++index < length) {
        if (array[index] === value) {
            return true;
        }
    }
    return false;
};

function removeDuplicates(array) {
    var exist = {};
    return array.filter(function (item) {
        return exist.hasOwnProperty(item) ? false : (exist[item] = true);
    });
}

function uniqueArray(array) {
    return array.filter(function(item, pos) {
        return array.indexOf(item) == pos;
    });
}

function isEmptyOrSpacesOrUndefined(str) {
    return str === null || String(str).match(/^ *$/) !== null || str === undefined;
}

function createMap(array, key) {
    let map = {};
    array.forEach(item => {
        map[item[key]] = item;
    });
    return map;
};

function createMapKeyValue(arr, key, name) {

    return (arr || []).reduce((keyValue, obj) => {

        if (name === null || name === undefined) {
            keyValue[obj[key]] = obj;
            return keyValue;
        } else {
            let stringName = String(name);
            keyValue[stringName + obj[key]] = obj;
            return keyValue;
        }


    }, {});

}

function objectEntries(obj){
    
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    
}

function howManyTimesTheValueAppears(arr) {

    let result = [];

    let res = arr.reduce((data, curr) => {
        data[curr] = data[curr] ? ++data[curr] : 1;
        return data;
    }, {});

    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };

    Object.entries(res).forEach(([val, numTimes]) => {
        if (numTimes > 1)
            result.push("O valor " + val + " aparece " + numTimes + " vezes");
    });

    if (!result.length) {
        result.push("Nenhum resultado encontrado ou todos os elementos aparecem apenas 1 vez.");
    }


    return result;
}




function hasChanged(object, oldObject, key, type) {

    if (!object) { return; }

    if ((object === undefined || object === null) || (key === undefined || key === null) || oldObject === undefined) {

        throw "Object e object[" + key + "] são obrigatórios. Object:" + JSON.stringify(object) + "/Key: " + key + "oldObject = " + JSON.stringify(oldObject);
    }

    if (!type) { throw "Tipo do campo não encontrado.Type: " + type; }

    if ((oldObject && oldObject[key]) && object[key] && typeof (object[key]) !== typeof (oldObject[key])) {
        throw "Object[" + key + "] = " + object[key] + " e oldObject[" + key + "]= " + oldObject[key] + " são de tipos diferentes";
    }

    let isChanged = false;

    if (object[key] && oldObject === null) {
        return isChanged = true;
    }

    switch (type) {
        case "number":
            isChanged = Number(object[key]) !== Number(oldObject[key]);
            break;
        case "string":
            isChanged = String(object[key]) !== String(oldObject[key]);
            break;
        case "boolean":
            isChanged = object[key] !== oldObject[key];
            break;
        case "object":
            isChanged = oldObject && object[key] &&
                (
                    !oldObject[key] ||
                    oldObject[key]._id !== object[key]._id
                )
            break;
        default:
            break;
    }

    return isChanged;


}

function monthDays(month, year) {
    var data = new Date(year, month, 0);
    return data.getDate();
}

function compareObjs(obj1, obj2) {
    let keys = Object.keys(obj1);
    try {
        return keys.every(key => {
            if (obj1[key] == null && obj2[key] == null) {
                return true;
            } else if ((obj1[key] != null && obj2[key] == null) || (obj1[key] == null && obj2[key] != null)) {
                return false;
            } else if (typeof obj1[key].getMonth === 'function' || typeof obj2[key].getMonth === 'function') {
                return this.compareDates(obj1[key], obj2[key]);
            } else if (typeof obj1[key] === 'string' || typeof obj1[key] === 'number' || typeof obj1[key] === 'boolean') {
                return obj1[key] == obj2[key];
            } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                return this.compareArrays(obj1[key], obj2[key]);
            } else if (obj1[key]._id && obj2[key]._id && obj1[key]._id === obj2[key]._id) {
                return true;
            }
            return false;
        });
    } catch (err) {
        return false;
    }
};

function compareArrays(array1, array2) {
    return array1.every(item1 => {
        return array2.some(item2 => {
            return this.compareObjs(item1, item2);
        });
    });
};

function compareDates(date1, date2) {
    if (!date1 || !date2) {
        return false;
    }
    date1 = typeof date1.getMonth === 'function' ? date1 : new Date(date1);
    date2 = typeof date2.getMonth === 'function' ? date2 : new Date(date2);

    return date1.getTime() === date2.getTime();
};


function camelCase(str) {
    var c = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\W+(.?)/g, function(match, chr) {
        return chr.toUpperCase();
    });
    return c.replace(/\w/, function(char) {
        return char.toLowerCase()
    }).trim();
}

function fieldChanged(fieldName, object, oldObject){
    let selected = false;
    let changed = false;
    
    let field = object[fieldName] ? object[fieldName] : oldObject[fieldName];
    
    if( field ) {
        if(typeof field == "object"){
            selected = object[fieldName] && !oldObject[fieldName] || !object[fieldName] && oldObject[fieldName];
            changed = object[fieldName] && oldObject[fieldName] && object[fieldName]._id !== oldObject[fieldName]._id;
        }
        else if(typeof field == "string") {
            selected = object[fieldName] && !oldObject[fieldName] || !object[fieldName] && oldObject[fieldName];
            changed = object[fieldName] && oldObject[fieldName] && object[fieldName] !== oldObject[fieldName];
        }
    }
    
    return selected || changed;
}

function validateObjectItIsFilled(obj){
    
    (Object.keys(obj) ||  []).forEach(field => {

        if(typeof(obj[field]) === "object"){
            validateObjectItIsFilled(obj[field]);
        }

        if(!isEmptyOrSpacesOrUndefined(obj[field])&& typeof(obj[field]) !== "object"){
            throw "O campo " + field + " está preenchido."
        }

    })

    console.log("Objecto não está preenchido.");

}

function flat(arr){
    return [].concat.apply([],arr);
}

function flattenDeep(arr1){
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
 }

function toUpperCase(str){
    return String(str).toUpperCase();
};

function toLocaleLowerCase(str){
    return String(str).toLocaleLowerCase();
};

function parseToArray(val){

    if(val === 0 || val === false)
        val = [val];
    
    val = (val || []);
    return  Array.isArray(val) ? val : [val];
            
    
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}




function removeMask(number) {
    if (number) {
        return String(number).replace(/[^\d]+/g, '');
    }
}

function singularOrPlural(counter, singularStr, pluralStr) {
    return counter > 1 ? pluralStr : singularStr;
}

function prepareSingularOrPlural(counter) {
    return (singularStr, pluralStr) => singularOrPlural(counter, pluralStr, singularStr);
}

function inQuotes(str) {
    return '"' + str + '"';
}

function makeString(arr, lastJoin) {
    lastJoin = lastJoin || 'e';
    
    if (arr.length === 1) {
        return arr[0];
    }

    const firsts = arr.slice(0, arr.length - 1);
    const last = arr[arr.length - 1];

    return firsts.join(', ') + ' ' + lastJoin + ' ' + last;
}

function firstLetterToUpperCase(str){
    return str.toLowerCase().replace(/(?:^|\s)(?!da|de|do)\S/g, l => l.toUpperCase());
}

function isCEPValid(cep){
    //Funciona apenas para CEP no Brasil
    if (!cep) {
          throw "CEP não informado";
      }
      const validacep = /^[0-9]{8}$/;
      cep = String(cep).replace(/[^0-9a-zA-Z]/g, '');
  
      return validacep.test(cep);
  
  }

function isObject(obj) {
    return obj && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
}

function isNotEmptyObject(obj) {
    return !isObject(obj) || Object.keys(obj).length > 0;
}

function padStart(str, targetLength, paddingChar) { 
    const newStr = paddingChar.repeat(targetLength) + str;
    return newStr.substr(newStr.length - targetLength);
}

function padEnd(str, targetLength, paddingChar) { 
    const newStr = str + paddingChar.repeat(targetLength);
    return newStr.substr(0, targetLength);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag] || tag));
}

function getErrorsStringFromException(e) {
    const errorsString = (e && e.javaException && e.javaException.getErrorsString()) || [];
    
    if (!errorsString.length) {
        return parseToArray(String(e));
    }
    
    const errors = [];
    
    // Esse "for" se faz necessário pois o getErrorsString retorna
    // um array com problemas de métodos, isto é, não é possível utilizar
    // "forEach", "concat", etc.
    for (let i = 0; i < errorsString.length; i++) {
        errors.push(errorsString[i]);
    }
    
    return errors;
}

function removeSpecialChars(str) {
    return isEmptyOrSpacesOrUndefined(str) || typeof str !== 'string' ? str : str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}