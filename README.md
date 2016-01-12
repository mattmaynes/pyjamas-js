# Versioned Persistable JavaScript - Viper-JS

## Overview
Viper is a simple JavaScript library for versioning and persisting objects and
reapplying them at a later time. Object persistence is a reflection of class
definitions which can lead to incompatibility as code changes. Viper offers a
solution to source changes in the form of *upgraders* that can be applied to
persisted objects to mutate fields to reflect the current state of the source
definition.

## Example

### Class Registration

```JavaScript
// Assume we have some class A that has instance variables foo and bar
var MyClass = function (){

    this.foo = 1;
    this.bar = 'Hello';
    ...
};

// Register the class with Viper and include the current version as well
// as the instance variables that are to be persisted.
Viper.register(MyClass, '0.1.2',{
    foo : Number,
    bar : String
})
// Add upgrader for conversion from saves older than version '0.1.1' to
// version '0.1.1'.
.upgrade('0.1.1', function(oldSave){
    oldSave.foo = 1;
    return oldSave;
})
// Add upgrader that will be applied to version older than '0.1.2' but newer
// than '0.1.1'. If a version is older than '0.1.1' then the upgraders will be
// applied in succession.
.upgrade('0.1.2', function(oldSave){
    oldSave.bar = 'Hello';
    return oldSave;
});

```

### Persistence and Construction

```JavaScript
// Create a new instance of MyClass
var obj = new MyClass();

// Manifrest a persistable object form
var json = Viper.toJSON(obj);

// Reconstruct the instance from above
var objCopy = Viper.construct(MyClass, json);
```
