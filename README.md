# Versioned Persistable JavaScript - Pyjamas

[![Build Status](https://travis-ci.org/mattmaynes/pyjamas-js.svg)](https://travis-ci.org/mattmaynes/pyjamas-js)
[![Coverage Status](https://coveralls.io/repos/mattmaynes/pyjamas-js/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattmaynes/pyjamas-js?branch=master)

## Overview
Pyjamas is a simple JavaScript library for versioning and persisting objects and
reapplying them at a later time. Object persistence is a reflection of class
definitions which can lead to incompatibility as code changes. Pyjamas offers a
solution to source changes in the form of *upgraders* that can be applied to
persisted objects to mutate fields to reflect the current state of the source
definition.

## Usage 

### Class Registration
Objects are registered to the Pyjamas database and then used to serialized
and de-serialize instances of the object with the same prototype. Objects 
need to be registered with the PyjamasDB before they are reflected or 
reconstructed. Registering an object to the PyjamasDB creates a new Pyjamas
instance that contains meta information that is essential to persisting 
and constructing instances.

```JavaScript
// Assume we have some class A that has instance variables foo and bar
var MyClass = function (){

    this.foo = 1;
    this.bar = 'Hello';
    ...
};

// Register the class with Pyjamas and include the current version as well
// as the instance variables that are to be persisted.
Pyjamas.register(MyClass, '0.1.2',{
    foo : Number,
    bar : String
})
// Add upgrader for conversion from saves older than version '0.1.1' to
// version '0.1.1'.
.upgrade('0.1.1', function(oldSave, newSave){
    newSave.foo = 1;
    return newSave;
})
// Add upgrader that will be applied to version older than '0.1.2' but newer
// than '0.1.1'. If a version is older than '0.1.1' then the upgraders will be
// applied in succession.
.upgrade('0.1.2', function(oldSave, newSave){
    newSave.bar = 'Hello';
    return newSave;
});

```

### Persistence and Construction
If an object has been registered into the PyjamasDB then we can use the Pyjamas
singleton to persist and reconstruct instances of that object.

```JavaScript
// Create a new instance of MyClass
var obj = new MyClass();

// Manifrest a persistable object form
var json = Pyjamas.toJSON(obj);

// Reconstruct the instance from above
var objCopy = Pyjamas.construct(MyClass, json);
```

## Roadmap
Pyjamas is currently fully functioning for **most** practical applications. In
the future there will be added support for custom version formats as currently
only the standard `major.minor.patch` versioning system is supported.

