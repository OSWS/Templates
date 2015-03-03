#### Open Source Web Standards
#### Templates | oswst
#### 1.0.0

---

#### Install

`git clone -b 1.0.0 git@github.com:OSWS/Templates.git oswst`

> package.json
```json
{
    "dependencies": {
        "oswst": "OSWS/Templates#1.0.0"
    }
}
```

---

#### Require

###### CommonJS
```js
var oswst = require('oswst');
```

###### RequireJS
```js
define(['oswst.min.js'], function(oswst) {});
```

###### window
```js
var oswst = window.oswst;
```