var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var defaultCalcData = {
    currentText: "0",
    lastText: "",
    currentOp: null,
    justCalculated: false,
};
var calcActions = {
    "+": function (x, y) { return x + y; },
    "-": function (x, y) { return x - y; },
    "*": function (x, y) { return x * y; },
    "/": function (x, y) { return x / y; },
    "^": function (x, y) { return Math.pow(x, y); },
};
function addNumber(data, num) {
    if (data.justCalculated) {
        return __assign(__assign({}, data), { currentText: num, justCalculated: false });
    }
    if (data.currentText === "0") {
        return __assign(__assign({}, data), { currentText: num });
    }
    return __assign(__assign({}, data), { currentText: data.currentText + num });
}
function setOperation(data, op) {
    if (data.currentOp && data.lastText !== "") {
        var res = executeCalc(data);
        return __assign(__assign({}, data), { currentText: res, lastText: res, currentOp: op, justCalculated: true });
    }
    return __assign(__assign({}, data), { lastText: data.currentText, currentOp: op, justCalculated: true });
}
function executeCalc(data) {
    if (!data.currentOp || !data.lastText)
        return data.currentText;
    var x = parseFloat(data.lastText);
    var y = parseFloat(data.currentText);
    var action = calcActions[data.currentOp];
    if (data.currentOp === "/" && y === 0)
        return "Ошибка";
    var result = action(x, y);
    return String(result);
}
function pressEquals(data) {
    if (!data.currentOp)
        return data;
    var res = executeCalc(data);
    return { currentText: res, lastText: "", currentOp: null, justCalculated: true };
}
function calcSquareRoot(data) {
    var val = parseFloat(data.currentText);
    if (val < 0) {
        return __assign(__assign({}, data), { currentText: "Ошибка", justCalculated: true });
    }
    var res = Math.sqrt(val);
    return __assign(__assign({}, data), { currentText: String(res), justCalculated: true });
}
function toggleSign(data) {
    if (data.currentText.charAt(0) === "-" || data.currentText === "Ошибка")
        return data;
    if (data.currentText.charAt(0) === "-") {
        return __assign(__assign({}, data), { currentText: data.currentText.slice(1) });
    }
    else {
        return __assign(__assign({}, data), { currentText: "-" + data.currentText });
    }
}
function resetCalc() {
    return __assign({}, defaultCalcData);
}
function updateDisplay(data) {
    var screen = document.getElementById("screen");
    screen.value = data.currentText;
}
function startCalcApp() {
    var calcData = __assign({}, defaultCalcData);
    var numberBtns = document.querySelectorAll(".num-btn");
    numberBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var digit = btn.getAttribute("data-num");
            calcData = addNumber(calcData, digit);
            updateDisplay(calcData);
        });
    });
    var opBtns = document.querySelectorAll(".op-btn");
    opBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var oper = btn.getAttribute("data-op");
            calcData = setOperation(calcData, oper);
            updateDisplay(calcData);
        });
    });
    var eqBtn = document.getElementById("btn-equal");
    eqBtn.addEventListener("click", function () {
        calcData = pressEquals(calcData);
        updateDisplay(calcData);
    });
    var sqrtBtn = document.getElementById("btn-root");
    sqrtBtn.addEventListener("click", function () {
        calcData = calcSquareRoot(calcData);
        updateDisplay(calcData);
    });
    var clrBtn = document.getElementById("btn-reset");
    clrBtn.addEventListener("click", function () {
        calcData = resetCalc();
        updateDisplay(calcData);
    });
    var signBtn = document.getElementById("btn-sign");
    signBtn.addEventListener("click", function () {
        calcData = toggleSign(calcData);
        updateDisplay(calcData);
    });
    updateDisplay(calcData);
}
window.addEventListener("DOMContentLoaded", startCalcApp);
