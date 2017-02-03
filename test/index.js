var Nightmare = require('nightmare');
var expect = require('chai').expect; // jshint ignore:line
var should = require('chai').should();

var utils = require('../src/utilities.js');
describe('String.kmark', function()
{
    it('given "1024", outcome should be "1,024"', function(done)
    {
        var s = "1024";
        s = s.kmark();
        s.should.equal('1,024');
        done();
    });
});

describe('Number.kmark', function()
{
    it('given 1024, outcome should be "1,024"', function(done)
    {
        var n = 1024;
        n = n.kmark();
        n.should.equal('1,024');
        done();
    });
});

describe('String.toDollar', function()
{
    it('given "1024.545", outcome should be "$1,024.55"', function(done)
    {
        var n = "1024.545";
        n = n.toDollar();
        n.should.equal('$1,024.55');
        done();
    });
});

describe('Number.toDollar', function()
{
    it('given 1024.545, outcome should be "$1,024.55"', function(done)
    {
        var n = 1024.545;
        n = n.toDollar();
        n.should.equal('$1,024.55');
        done();
    });
});

describe('String.toFloat', function()
{
    it('given "1024.545", outcome should be 1024.545', function(done)
    {
        var n = "1024.545";
        n = n.toFloat();
        n.should.equal(1024.545);
        done();
    });
});

describe('Number.toFloat', function()
{
    it('given 1024.545, outcome should be 1024.545', function(done)
    {
        var n = 1024.545;
        n = n.toFloat();
        n.should.equal(1024.545);
        done();
    });
});

describe('String.DoubleDigit', function()
{
    it('given "3", outcome should be "03"', function(done)
    {
        var n = "3";
        n = n.DoubleDigit();
        n.should.equal("03");
        done();
    });
});

describe('Number.DoubleDigit', function()
{
    it('given 3, outcome should be "03"', function(done)
    {
        var n = 3;
        n = n.DoubleDigit();
        n.should.equal("03");
        done();
    });
});

describe('Array.equals', function()
{
    it('given [1,2,3,4,5,6,7,8,9,0] and [1,2,"e",4,"s",6,"t",8,9,0]', function(done)
    {
        var n = [1,2,3,4,5,6,7,8,9,0];
        var nn = [1,2,'e',4,'s',6,'t',8,9,0];
        var b = n.equals(nn);
        b.should.equal(false);
        done();
    });
});

describe('Array.shuffle', function()
{
    it('given [1,2,3,4,5,6,7,8,9,0], and outcome should be shuffled', function(done)
    {
        var n = [1,2,3,4,5,6,7,8,9,0];
        var nn = [1,2,3,4,5,6,7,8,9,0];
        n.shuffle();
        var b = n.equals(nn);
        b.should.equal(false);
        done();
    });
});

describe('Array.removeByValue', function()
{
    it('given [1,2,3,4,5,6,7,8,9,0], want to remove 4, and outcome should be [1,2,3,5,6,7,8,9,0]', function(done)
    {
        var n = [1,2,3,4,5,6,7,8,9,0];
        n.removeByValue(4);
        var b = n.equals([1,2,3,5,6,7,8,9,0]);
        b.should.equal(true);
        done();
    });
});

// describe('Object.clone', function()
// {
//     it('given {name: "leo chen", age: 34}, and outcome should be the same', function(done)
//     {
//         var n = {name: "leo chen", age: 34};
//         var nn = utils.clone(n);
//         var b = JSON.stringify(n) === JSON.stringify(nn);
//         b.should.equal(true);
//         done();
//     });
// });

describe('test SH website main nav items', function()
{
    this.timeout(15000);
    it('should find 8 items', function(done)
    {
        var nightmare = Nightmare();

        nightmare
            .goto('https://www.saltedherring.com')
            .wait('#main_nav a')
            .evaluate(function () {
                return $('#main_nav a').length
            })
            .end()
            .then(function(link) {
                link.should.equal(8);
                done();
            })
            .catch(done);
    });

    it('should find 4 items', function(done)
    {
        var nightmare = Nightmare();

        nightmare
            .goto('https://www.saltedherring.com')
            .wait('#main_nav a')
            .evaluate(function () {
                return $('#main_nav a').length
            })
            .end()
            .then(function(link) {
                link.should.equal(4);
                done();
            })
            .catch(done);
    });
});

describe('Test Salted JS library', function()
{
    this.timeout(3600000);
    it('kmark function to add a thousand separator to a STRING.', function(done)
    {
        var nightmare = Nightmare();

        nightmare
            .goto('https://www.nzyogo.co.nz')
            .evaluate(function () {
                return ('1024').kmark();
            })
            .end()
            .then(function(result) {
                result.should.equal('1,024');
                done();
            })
            .catch(done);
    });

    it('kmark function to add a thousand separator to an INTEGER', function(done)
    {
        var nightmare = Nightmare();

        nightmare
            .goto('https://www.nzyogo.co.nz')
            .evaluate(function () {
                return (1024).kmark();
            })
            .end()
            .then(function(result) {
                result.should.equal('1,024');
                done();
            })
            .catch(done);
    });

    it('toDollar function to format an INTEGER: 1024 to $1,024.00', function(done)
    {
        var nightmare = Nightmare();

        nightmare
            .goto('https://www.nzyogo.co.nz')
            .evaluate(function () {
                return (1024).toDollar();
            })
            .end()
            .then(function(result) {
                result.should.equal('$1,024.00');
                done();
            })
            .catch(done);
    });
});
