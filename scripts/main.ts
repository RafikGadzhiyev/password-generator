interface IData {
    passwordLength: number,
    isUppercaseActive: boolean,
    isLowerCaseActive: boolean,
    isNumbersActive: boolean,
    isSymboslActive: boolean,
    generatedPassword: string
}

type PasswordLevels = 'very easy' | 'easy' | 'medium' | 'hard';

const shuffle = (arr: any[]) => {
    for (let i = 0; i < arr.length; ++i) {
        let randomIndex = ~~(Math.random() * arr.length);
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
}

const checkPasswordLevel = (data: IData): PasswordLevels => {
    let currentScore: number = data.passwordLength,
        totalActive = 0 + (data.isLowerCaseActive ? 1 : 0) + (data.isNumbersActive ? 1 : 0) + (data.isSymboslActive ? 1 : 0) + (data.isUppercaseActive ? 1 : 0);
    if (currentScore <= 5) return 'very easy';
    else if (currentScore <= 10 && totalActive < 2) return 'very easy';
    else if (currentScore <= 10 && totalActive >= 2) return 'easy';
    else if (currentScore > 10 && currentScore < 15 && totalActive > 2) return 'medium';

    return totalActive < 1 ? 'very easy' : totalActive === 1 ? 'easy' : totalActive === 2 ? 'medium' : 'hard';
}

const changeDifficultyState = (level: PasswordLevels, strengthLabel: HTMLSpanElement, strengthIndicator: NodeListOf<HTMLDivElement>) => {
    const MAX = {
        'very easy': 1,
        'easy': 2,
        'medium': 3,
        'hard': 4

    }
    strengthLabel.textContent = level;
    let currentMax: number = MAX[level];
    strengthIndicator.forEach((indicator: HTMLDivElement, index: number) => {
        indicator.className = 'strength-bar';
        if (index < currentMax) {
            indicator.classList.add(level.replace(/\s/g, '-'))
        } else {
            indicator.className = 'strength-bar empty';
        }
    })
}

(function () {
    const Data: IData = {
        passwordLength: 0,
        isLowerCaseActive: true,
        isNumbersActive: true,
        isSymboslActive: true,
        isUppercaseActive: true,
        generatedPassword: ''
    }

    const LETTERS: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const NUMBERS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const SYMBOLS: string[] = ['!', '?', '#', '@', '$', '&', '%'];

    const passwordLengthRange: HTMLInputElement | null = document.querySelector('.password-length-range');
    const currentPasswordLength: HTMLSpanElement | null = document.querySelector('.password-length-number');
    const setupCheckBoxes: NodeListOf<HTMLInputElement> | null = document.querySelectorAll('.extra-setup-choose-button');
    const generatePasswordButton: HTMLButtonElement | null = document.querySelector('.generate-button');
    const lastGeneratedPassword: HTMLInputElement | null = document.querySelector('.generated-password');
    const strengthText: HTMLSpanElement | null = document.querySelector('.strength-data-text');
    const strengthIndicators: NodeListOf<HTMLDivElement> | null = document.querySelectorAll('.strength-bar');
    const copyButton: HTMLButtonElement | null = document.querySelector('.copy-button');

    let currentPasswordLevel: PasswordLevels = 'hard';

    if (passwordLengthRange && currentPasswordLength) {
        Data.passwordLength = +passwordLengthRange.value;
        currentPasswordLevel = checkPasswordLevel(Data);
        if (strengthText && strengthIndicators) {
            changeDifficultyState(currentPasswordLevel, strengthText, strengthIndicators)
        }
        passwordLengthRange.oninput = (e: Event) => {
            let currentValue: string = (e.target as HTMLInputElement).value,
                maxValue: number = +(e.target as HTMLInputElement).max,
                minValue: number = +(e.target as HTMLInputElement).min;
            currentPasswordLength.textContent = currentValue;
            passwordLengthRange.style.backgroundSize = `${(+currentValue - minValue + 1) / (maxValue + 1) * 100}% 100%`;

            Data.passwordLength = +currentValue;
            currentPasswordLevel = checkPasswordLevel(Data);
            if (strengthText && strengthIndicators) {
                changeDifficultyState(currentPasswordLevel, strengthText, strengthIndicators)
            }
        }
    }

    if (setupCheckBoxes) {
        setupCheckBoxes.forEach((checkbox: HTMLInputElement, index: number) => {
            checkbox.onchange = () => {
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
                    changeDifficultyState(currentPasswordLevel, strengthText, strengthIndicators)
                }
            }
        })
    }

    if (generatePasswordButton) {
        generatePasswordButton.onclick = () => {
            Data.generatedPassword = '';
            const allPossibleSymbols: any[] = [];
            if (Data.isLowerCaseActive) {
                allPossibleSymbols.push(...LETTERS);
            }
            if (Data.isUppercaseActive) {
                allPossibleSymbols.push(...LETTERS.map(e => e.toUpperCase()))
            }
            if (Data.isSymboslActive) {
                allPossibleSymbols.push(...SYMBOLS);
            }
            if (Data.isNumbersActive) {
                allPossibleSymbols.push(...NUMBERS);
            }
            if (allPossibleSymbols.length === 0) return;
            shuffle(allPossibleSymbols);
            for (let i = 0; i < Data.passwordLength; ++i) {
                Data.generatedPassword += allPossibleSymbols[~~(Math.random() * allPossibleSymbols.length)]
            }

            if (lastGeneratedPassword) {
                lastGeneratedPassword.textContent = Data.generatedPassword;
            }
        }
    }

    if (copyButton) {
        copyButton.onclick = () => {
            navigator.clipboard.writeText(lastGeneratedPassword?.textContent || '')
            alert('Copied!');
        }
    }

})()