// Mocking browser environment
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
    };
})();

global.localStorage = localStorageMock;

const DEFAULT_SETTINGS = {
    monthlySalary: 19000,
    shifts: [
        { start: "08:40", penalty: "09:30", end: "10:00" },
        { start: "13:15", penalty: "13:45", end: "14:15" },
        { start: "18:00", penalty: "18:30", end: "19:00" }
    ],
    adminPassword: "4248",
    maidPassword: "anita",
    currency: "₹",
    darkMode: false
};

let state = {
    settings: { ...DEFAULT_SETTINGS },
    attendance: {},
    credits: 0,
    payouts: [],
    lastPayoutDate: null,
    faceEnrolled: true
};

function getTimeInMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function getNowInMinutes(date) {
    return date.getHours() * 60 + date.getMinutes();
}

function getCurrentShiftInfo(date) {
    const nowMins = getNowInMinutes(date);
    const todayAttendance = {}; // Mock
    let nextShift = null;

    for (let i = 0; i < state.settings.shifts.length; i++) {
        const shiftCfg = state.settings.shifts[i];
        const startMins = getTimeInMinutes(shiftCfg.start);
        const penaltyMins = getTimeInMinutes(shiftCfg.penalty);
        const endMins = getTimeInMinutes(shiftCfg.end);

        if (todayAttendance[`shift${i}`]) continue;

        if (nowMins >= startMins && nowMins <= endMins) {
            let status = 'on-time';
            if (nowMins > penaltyMins) status = 'late';
            return { active: true, index: i, startTime: shiftCfg.start, status };
        }
        if (nowMins < startMins && !nextShift) {
            nextShift = { active: false, index: i, startTime: shiftCfg.start };
        }
    }
    return nextShift;
}

// Test Case 1: Before Shift 1
console.log("Test Case 1: 8:00 AM (Before S1)");
console.log(getCurrentShiftInfo(new Date(2023, 9, 1, 8, 0)));
// Expected: active: false, index: 0

// Test Case 2: During Shift 1 (On-time)
console.log("\nTest Case 2: 9:00 AM (During S1, On-time)");
console.log(getCurrentShiftInfo(new Date(2023, 9, 1, 9, 0)));
// Expected: active: true, index: 0, status: 'on-time'

// Test Case 3: During Shift 1 (Late)
console.log("\nTest Case 3: 9:40 AM (During S1, Late)");
console.log(getCurrentShiftInfo(new Date(2023, 9, 1, 9, 40)));
// Expected: active: true, index: 0, status: 'late'

// Test Case 4: After Shift 1, Before Shift 2
console.log("\nTest Case 4: 11:00 AM (After S1, Before S2)");
console.log(getCurrentShiftInfo(new Date(2023, 9, 1, 11, 0)));
// Expected: active: false, index: 1

// Test Case 5: During Shift 2 (Late)
console.log("\nTest Case 5: 1:50 PM (During S2, Late)");
console.log(getCurrentShiftInfo(new Date(2023, 9, 1, 13, 50)));
// Expected: active: true, index: 1, status: 'late'
