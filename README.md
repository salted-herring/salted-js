# salted-js
Salted JS is the base javascript library that Salted Herring uses to develop most of our websites.

## install
    ```sh
    bower install --save salted-js
    ```
## API Documentation

### Utilities
#### Prototypes
##### String.kmark
return a string with ',' separator in it

    example:
    ```javascript
    var s = '1024';
    s = s.kmark();
    console.log(s); //1,024
    ```

##### String.toDollar, Number.toDollar. parameter: null | integer - how many digits to keep after decimal. Default to 2
return a currency format of the given value

    example:
    ```javascript
    var s = '1024';
    s = s.toDollar(2);
    console.log(s); //'$1,024.00'

    var n = 1024.768;
    n = n.toDollar();
    console.log(n); // '$1,024.77';
    ```

##### String.toFloat, Number.toFloat
covert numeric string into float (also works on currency format). Number.toFloat: sometimes, you don't know what type the given value is...

    example:
    ```javascript
    var s = '$1,024.00';
    s = s.toFloat();
    console.log(s); //1024
    ```

##### String.DoubleDigit, Number.DoubleDigit
return a 2-digit string if the given value is less than 10 or is just 1-char long

    example:
    ```javascript
    var s = '1';
    s = s.DoubleDigit();
    console.log(s); //'01'

    var n = 8;
    n = n.DoubleDigit();
    console.log(n); // '08'
    ```

##### Date.now
a toString() function that prints a date object in the format of "yyyy-mm-dd hh:mm:ss" (IT DOESN'T GIVE YOU THE ACTUAL CURRENT DATETIME!)

    example:
    ```javascript
    var d = new Date();
    console.log(d.now()); //"2016-10-31 11:37:22"
    ```

##### Array.shuffle
shuffle the given array

    example:
    ```javascript
    var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
    arr.shuffle(); //["b", "a", "i", "g", "h", "e", "c", "k", "d", "f", "j"]
    ```

#### Anonymous functions
##### QueryString
return the URL's querystring in Object type

    example:
    ```javascript
    //http://the-site.com?foo=bar&user=leo
    console.log(QueryString.foo); // "bar"
    console.log(QueryString.user); // "leo"
    ```

##### isMobile
return true if the user is visiting the site from a mobile device

#### Functions
##### getRandomInt(min, max)
obtain a random integer from a range (including the boundaries)

    example:
    ```javascript
    getRandomInt(1, 5);
    ```

##### getRandomArbitrary(mod)
obtain a "very random" number between 0 and 10

    example:
    ```javascript
    getRandomArbitrary(3);
    ```

##### shuffle
the function version of Array.shuffle prototype overload

##### trace(el, line)
lazy habit from AS3. Same as console.log(); el: anything, line: the line number. Nullable

##### isAboveViewport(el, offset)
detect whether an element is ABOVE the viewable area (A.K.A, above the screen display)

##### getOrientation(file, callback)
read selected image's orientation. file: the input[type="file"] element
    example:
    ```javascript

    getOrientation(input.files[0], function(orientation) {
        switch (orientation) {
            case 3:
                //upside down
                break;
            case 6:
                //upside left
                break;
            case 8:
                //upside right
                break;
        }
    });
    ```

##### clone(obj)
clone the given object

### jQuery plugins
#### $.margin('horizontal' | 'vertical')
return the element's total horizontal or vertical margin value.

#### $.padding('horizontal' | 'vertical')
return the element's total horizontal or vertical padding value.

#### $.gutter('horizontal' | 'vertical')
return the element's total horizontal or vertical margin and padding value.


## MORE TO COME
