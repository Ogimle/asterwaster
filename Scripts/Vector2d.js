//////////////////////////////////////////////////////////////////////////////////
// Vector2d V1.0.0
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software
//////////////////////////////////////////////////////////////////////////////////

function Vector2d()
{
    if (arguments.length == 1)
    {
        this.x = arguments[0].x;
        this.y = arguments[0].y;
    }
    else
    {
        this.x = arguments[0];
        this.y = arguments[1];
    }
}

// Multiply vector.
Vector2d.prototype.mul = function(mul)
{
    this.x *= mul;
    this.y *= mul;
    return(this);
};

Vector2d.prototype.scale = Vector2d.prototype.mul;

// Add a vector.
Vector2d.prototype.add = function(v2)
{
    this.x += v2.x;
    this.y += v2.y;
    return(this);
};

// Subtract a vector.
Vector2d.prototype.sub = function(v2)
{
    this.x -= v2.x;
    this.y -= v2.y;
    return(this);
};

// Length of vector.
Vector2d.prototype.len = function()
{
    return Math.sqrt(this.x*this.x + this.y*this.y);
};

// A faster length calculation that returns the length squared.
// Useful if all you want to know is that one vector is longer than another.
Vector2d.prototype.lengthSquared = function () {
    return this.x * this.x + this.y * this.y;
};


// Normalize (unit length). Also returns length before normalisation.
// 2-20-17 normalize the spelling of normalise to normalize
Vector2d.prototype.normalize = function()
{
    var len = Math.sqrt(this.x*this.x + this.y*this.y);
    if(len) {
        this.x /= len;
        this.y /= len;
    }
    return(this);
};

// Dot product.
Vector2d.prototype.dotProd = function(v2)
{
    return (this.x * v2.x) + (this.y * v2.y);
};

// Rotate vector by an angle in radians.
Vector2d.prototype.rotate = function(ang)
{
    this.x = (this.x * Math.cos(ang)) - (this.y * Math.sin(ang));
    this.y = (this.y * Math.cos(ang)) + (this.x * Math.sin(ang));
    return(this);
};

// Negate vector (point in opposite direction).
Vector2d.prototype.negate = function()
{
    this.x = -this.x;
    this.y = -this.y;
    return(this);
};

//toString function.
Vector2d.prototype.toString = function()
{
    return 'x = ' + this.x + ', y = ' + this.y;
};

// 2-20-17 added copy()
Vector2d.prototype.copy =  function() {
    return(new Vector2d(this.x, this.y));
};

// 2-20-17 added dist()
Vector2d.prototype.distance = function (vec2) {
    return(vec2.copy().sub(this).len());
};

// 2-20-17 added angleBetween()
Vector2d.prototype.angleBetween = function (vec2) {
    return(vec2.angle() - this.angle());
};

// 2-20-17 added angle()
Vector2d.prototype.angle =  function () {
    return(Math.atan2(this.y, this.x));
};

Vector2d.lineIntersectsCircle = function(ahead, ahead2, x,y,radius)
{
    var sx = x - ahead.x;
    var sy = y - ahead.y;
    var dist = Math.sqrt(sx*sx + sy*sy);

    sx = x - ahead2.x;
    sy = x - ahead2.y;
    var dist2 = Math.sqrt(sx*sx + sy*sy);

    if (dist <= radius || dist2 <= radius) return true;
    return false;
};