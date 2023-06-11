const Characters = 'CDFGHJKLMNPQRVWX3469';
const NumChars = Characters.length;

const IgnoredManualCharacters = '-' + ' ';
const ManualCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789' + IgnoredManualCharacters;

function isAlphaNumeric(str: string) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

export default class TTCodeDict {
    manualOnlyCharacters: string;
    charactersSet: Set<string>;
    manualCharactersSet: Set<string>;
    bruteForceFactor: number;

    constructor() {
        this.manualOnlyCharacters = '';
        this.charactersSet = new Set(Characters);
        this.manualCharactersSet = new Set(ManualCharacters);
        this.bruteForceFactor = 1000;

        for (let char of ManualCharacters) {
            if (!IgnoredManualCharacters.includes(char)) {
                if (!Characters.includes(char)) {
                    this.manualOnlyCharacters += char;
                }
            }
        }
    }

    isLegalCode(code: string): boolean {
        return this.isLegalUniqueCode(code) || this.isLegalNonUniqueCode(code);
    }

    isLegalUniqueCode(code: string): boolean {
        let readableCode = Array.from(this.getFromReadableCode(code));
        const difference = new Set([...readableCode].filter((x) => !this.charactersSet.has(x)));

        return difference.size == 0;
    }

    isLegalNonUniqueCode(code: string): boolean {
        for (let char of code) {
            if (!this.isValidManualChar(char)) {
                return false;
            }
        }

        return true;
    }

    isValidManualChar(char: string): boolean {
        if (IgnoredManualCharacters.includes(char)) {
            return true;
        }

        return isAlphaNumeric(char);
    }

    isManualOnlyChar(char: string): boolean {
        if (this.charactersSet.has(char)) {
            return false;
        }

        //any unicode alphanumeric character that is not in the auto-generated character set
        //is a manual-only character
        return isAlphaNumeric(char);
    }

    getFromReadableCode(code: string): Set<string> {
        return new Set(code.toUpperCase().split(/|, |/));
    }
}