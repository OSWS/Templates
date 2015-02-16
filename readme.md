# [OSWS](https://github.com/OSWS) [Templates](https://github.com/OSWS/OSWS-Templates) [0.3.0](https://github.com/OSWS/OSWS-Templates/wiki/0.3.0)

### [Documentation](https://github.com/OSWS/OSWS-Templates/wiki)

#### Example

###### Create `temp.js`

```js
var T = require('osws-templates');

with (T.with) {

module.exports = data(
    doctypes.html(),
    html()(
        head()(
            title()('example'),
            css('style.css'),
            js('require.js', {'data-main': 'index.js'})
        ),
        body()(
            div('.sync-divs')(
                sync(function() {
                    var b = data();
                    for (var a in [1,2,3,4,5]) {
                        b.append(div({'data-index': a})())
                    }
                    return b;
                })
            ), div('.async-divs')(
                async(function(callback) {
                    var b = data();
                    for (var a in [1,2,3,4,5]) {
                        b.append(div({'data-index': a})())
                    }
                    callback(null, b);
                })
            )
        )
    )
)

}
```

###### Compile
```bash
osws-templates -s temp.js
```

###### Result `temp.html`

```html
<!DOCTYPE html>
<html>

<head>
    <title>example</title>
    <link rel="stylesheet" href="style.css" />
    <script type="text/javascript" src="require.js" data-main="index.js"></script>
</head>

<body>
    <div class="sync-divs">
        <div data-index="0"></div>
        <div data-index="1"></div>
        <div data-index="2"></div>
        <div data-index="3"></div>
        <div data-index="4"></div>
    </div>
    <div class="async-divs">
        <div data-index="0"></div>
        <div data-index="1"></div>
        <div data-index="2"></div>
        <div data-index="3"></div>
        <div data-index="4"></div>
    </div>
</body>

</html>
```