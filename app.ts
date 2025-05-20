interface CalcData {
    currentText: string;
    lastText: string;
    currentOp: string | null;
    justCalculated: boolean;
}

const defaultCalcData: CalcData = {
    currentText: "0",
    lastText: "",
    currentOp: null,
    justCalculated: false,
};

const calcActions: Record<string, (x: number, y: number) => number> = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
    "^": (x, y) => Math.pow(x, y),
};

function addNumber(data: CalcData, num: string): CalcData {
    if (data.justCalculated) {
        return { ...data, currentText: num, justCalculated: false };
    }
    if (data.currentText === "0") {
        return { ...data, currentText: num };
    }
    return { ...data, currentText: data.currentText + num };
}

function setOperation(data: CalcData, op: string): CalcData {
    if (data.currentOp && data.lastText !== "") {
        const res = executeCalc(data);
        return {
            ...data,
            currentText: res,
            lastText: res,
            currentOp: op,
            justCalculated: true,
        };
    }
    return { ...data, lastText: data.currentText, currentOp: op, justCalculated: true };
}

function executeCalc(data: CalcData): string {
    if (!data.currentOp || !data.lastText) return data.currentText;

    const x = parseFloat(data.lastText);
    const y = parseFloat(data.currentText);
    const action = calcActions[data.currentOp];

    if (data.currentOp === "/" && y === 0) return "Ошибка";

    const result = action(x, y);
    return String(result);
}

function pressEquals(data: CalcData): CalcData {
    if (!data.currentOp) return data;
    const res = executeCalc(data);
    return { currentText: res, lastText: "", currentOp: null, justCalculated: true };
}

function calcSquareRoot(data: CalcData): CalcData {
    const val = parseFloat(data.currentText);
    if (val < 0) {
        return { ...data, currentText: "Ошибка", justCalculated: true };
    }
    const res = Math.sqrt(val);
    return { ...data, currentText: String(res), justCalculated: true };
}

function toggleSign(data: CalcData): CalcData {
    if (data.currentText.charAt(0) === "-" || data.currentText === "Ошибка") return data;

    if (data.currentText.charAt(0) === "-") {
        return { ...data, currentText: data.currentText.slice(1) };
    } else {
        return { ...data, currentText: "-" + data.currentText };
    }
}

function resetCalc(): CalcData {
    return { ...defaultCalcData };
}

function updateDisplay(data: CalcData) {
    const screen = document.getElementById("screen") as HTMLInputElement;
    screen.value = data.currentText;
}

function startCalcApp() {
    let calcData: CalcData = { ...defaultCalcData };

    const numberBtns = document.querySelectorAll<HTMLButtonElement>(".num-btn");
    numberBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const digit = btn.getAttribute("data-num")!;
            calcData = addNumber(calcData, digit);
            updateDisplay(calcData);
        });
    });

    const opBtns = document.querySelectorAll<HTMLButtonElement>(".op-btn");
    opBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const oper = btn.getAttribute("data-op")!;
            calcData = setOperation(calcData, oper);
            updateDisplay(calcData);
        });
    });

    const eqBtn = document.getElementById("btn-equal")!;
    eqBtn.addEventListener("click", () => {
        calcData = pressEquals(calcData);
        updateDisplay(calcData);
    });

    const sqrtBtn = document.getElementById("btn-root")!;
    sqrtBtn.addEventListener("click", () => {
        calcData = calcSquareRoot(calcData);
        updateDisplay(calcData);
    });

    const clrBtn = document.getElementById("btn-reset")!;
    clrBtn.addEventListener("click", () => {
        calcData = resetCalc();
        updateDisplay(calcData);
    });

    const signBtn = document.getElementById("btn-sign")!;
    signBtn.addEventListener("click", () => {
        calcData = toggleSign(calcData);
        updateDisplay(calcData);
    });

    updateDisplay(calcData);
}

window.addEventListener("DOMContentLoaded", startCalcApp);
