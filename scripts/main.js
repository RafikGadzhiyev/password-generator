var shuffle = function (arr) {
    var _a;
    for (var i = 0; i < arr.length; ++i) {
        var randomIndex = ~~(Math.random() * arr.length);
        _a = [arr[randomIndex], arr[i]], arr[i] = _a[0], arr[randomIndex] = _a[1];
    }
};
var checkPasswordLevel = function (data) {
    var currentScore = data.passwordLength, totalActive = 0 + (data.isLowerCaseActive ? 1 : 0) + (data.isNumbersActive ? 1 : 0) + (data.isSymboslActive ? 1 : 0) + (data.isUppercaseActive ? 1 : 0);
    if (currentScore <= 5)
        return 'very easy';
    else if (currentScore <= 10 && totalActive < 2)
        return 'very easy';
    else if (currentScore <= 10 && totalActive >= 2)
        return 'easy';
    else if (currentScore > 10 && currentScore < 15 && totalActive > 2)
        return 'medium';
    return totalActive < 1 ? 'very easy' : totalActive === 1 ? 'easy' : totalActive === 2 ? 'medium' : 'hard';
};
var changeDifficultyState = function (level, strengthLabel, strengthIndicator) {
    var MAX = {
        'very easy': 1,
        'easy': 2,
        'medium': 3,
        'hard': 4
    };
    strengthLabel.textContent = level;
    var currentMax = MAX[level];
    strengthIndicator.forEach(function (indicator, index) {
        indicator.className = 'strength-bar';
        if (index < currentMax) {
            indicator.classList.add(level.replace(/\s/g, '-'));
        }
        else {
            indicator.className = 'strength-bar empty';
        }
    });
};
(function () {
    var Data = {
        passwordLength: 0,
        isLowerCaseActive: true,
        isNumbersActive: true,
        isSymboslActive: true,
        isUppercaseActive: true,
        generatedPassword: ''
    };
    var LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var SYMBOLS = ['!', '?', '#', '@', '$', '&', '%'];
    var passwordLengthRange = document.querySelector('.password-length-range');
    var currentPasswordLength = document.querySelector('.password-length-number');
    var setupCheckBoxes = document.querySelectorAll('.extra-setup-choose-button');
    var generatePasswordButton = document.querySelector('.generate-button');
    var lastGeneratedPassword = document.querySelector('.generated-password');
    var strengthText = document.querySelector('.strength-data-text');
    var strengthIndicators = document.querySelectorAll('.strength-bar');
    var copyButton = document.querySelector('.copy-button');
    var currentPasswordLevel = 'hard';
    if (passwordLengthRange && currentPasswordLength) {
        Data.passwordLength = +passwordLengthRange.value;
        currentPasswordLevel = checkPasswordLevel(Data);
        if (strengthText && strengthIndicators) {
            changeDifficultyState(currentPasswordLevel, strengthText, strengthIndicators);
        }
        passwordLengthRange.oninput = function (e) {
            var currentValue = e.target.value, maxValue = +e.target.max, minValue = +e.target.min;
            currentPasswordLength.textContent = currentValue;
            passwordLengthRange.style.backgroundSize = "".concat((+currentValue - minValue + 1) / (maxValue + 1) * 100, "% 100%");
            Data.passwordLength = +currentValue;
            currentPasswordLevel = checkPasswordLevel(Data);
            if (strengthText && strengthIndicators) {
                changeDifficultyState(currentPasswordLevel, strengthText, strengthIndicators);
            }
        };
    }
    if (setupCheckBoxes) {
        setupCheckBoxes.forEach(function (checkbox, index) {
            checkbox.onchange = function () {
                switch (index) {
                    case 0:
                        Data.isUppercaseActive = checkbox.checked;
                        break;
                    case 1:
                        Data.isLowerCaseActive = checkbox.checked;
                        break;
                    case 2:
                        Data.isNumbersActive = checkbox.checked;
                        break;
                    case 3:
                        Data.isSymboslActive = checkbox.checked;
                        break;
                }
                currentPasswordLevel = checkPasswordLevel(Data);
                if (strengthText && strengthIndicators) {
                    changeDifficultyState(currentPasswordLevel, strengthText, strengthIndicators);
                }
            };
        });
    }
    if (generatePasswordButton) {
        generatePasswordButton.onclick = function () {
            Data.generatedPassword = '';
            var allPossibleSymbols = [];
            if (Data.isLowerCaseActive) {
                allPossibleSymbols.push.apply(allPossibleSymbols, LETTERS);
            }
            if (Data.isUppercaseActive) {
                allPossibleSymbols.push.apply(allPossibleSymbols, LETTERS.map(function (e) { return e.toUpperCase(); }));
            }
            if (Data.isSymboslActive) {
                allPossibleSymbols.push.apply(allPossibleSymbols, SYMBOLS);
            }
            if (Data.isNumbersActive) {
                allPossibleSymbols.push.apply(allPossibleSymbols, NUMBERS);
            }
            if (allPossibleSymbols.length === 0)
                return;
            shuffle(allPossibleSymbols);
            for (var i = 0; i < Data.passwordLength; ++i) {
                Data.generatedPassword += allPossibleSymbols[~~(Math.random() * allPossibleSymbols.length)];
            }
            if (lastGeneratedPassword) {
                lastGeneratedPassword.textContent = Data.generatedPassword;
            }
        };
    }
    if (copyButton) {
        copyButton.onclick = function () {
            navigator.clipboard.writeText((lastGeneratedPassword === null || lastGeneratedPassword === void 0 ? void 0 : lastGeneratedPassword.textContent) || '');
            alert('Copied!');
        };
    }
})();
