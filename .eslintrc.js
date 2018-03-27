module.exports = {
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "node": true,
        "jasmine": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4,
            { "MemberExpression": 0 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": [
            "error", {
                "args": "none"
            }
        ],
        "no-var": [
            "error"
        ],
        "prefer-const": [
            "error"
        ],
        "for-direction": [
            "error"
        ],
        "getter-return": [
            "error"
        ],
        "no-await-in-loop": [
            "error"
        ],
        "no-compare-neg-zero": [
            "error"
        ],
        "no-cond-assign": [
            "error",
            "always"
        ],
        "no-console": [
            "error"
        ],
        "no-constant-condition": [
            "error"
        ],
        "no-debugger": [
            "error"
        ],
        "no-dupe-args": [
            "error"
        ],
        "promise/catch-or-return": [
            "error"
        ],
        "promise/no-return-wrap": [
            "error"
        ],
        "promise/param-names": [
            "error"
        ],
        "promise/no-nesting": [
            "error"
        ],
        "promise/no-promise-in-callback": [
            "error"
        ],
        "promise/no-return-in-finally": [
            "error"
        ],
    },
    "plugins": [
        "promise"
    ]
};
