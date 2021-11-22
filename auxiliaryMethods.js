module.exports = {

    contains: contains,
    removeDuplicates: removeDuplicates,
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
    validateObjectItIsFilled : validateObjectItIsFilled
};


function contains(array, value) {
    var index = -1;
    var length = array.length;
    while (++index < length) {
        if (array[index] == value) {
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

        throw "Object e object[" + key + "] são obrigatórios. Object:" + _utils.stringifyAsJson(object) + "/Key: " + key + "oldObject = " + _utils.stringifyAsJson(oldObject);
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
        case "objectAsString":
            isChanged = _utils.stringifyAsJson(object[key]) !== _utils.stringifyAsJson(oldObject[key]);

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
                // throw key + " - null" + obj2[key] + ' * *' + _utils.stringifyAsJson(obj1[key]);
                return false;
            } else if (typeof obj1[key].getMonth === 'function' || typeof obj2[key].getMonth === 'function') {
                // if (!this.compareDates(obj1[key], obj2[key])) throw key + " - date";
                return this.compareDates(obj1[key], obj2[key]);
            } else if (typeof obj1[key] === 'string' || typeof obj1[key] === 'number' || typeof obj1[key] === 'boolean') {
                // if (!(obj1[key] == obj2[key])) throw key + " - primitivo - " + obj1[key] + " - " + obj2[key];
                return obj1[key] == obj2[key];
            } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                // if (!this.compareArrays(obj1[key], obj2[key])) throw key + " - Array";
                return this.compareArrays(obj1[key], obj2[key]);
            } else if (obj1[key]._id && obj2[key]._id && obj1[key]._id === obj2[key]._id) {
                return true;
            }
            // throw key + " - nenhuma condição";
            return false;
        });
    } catch (err) {
        // throw err;
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