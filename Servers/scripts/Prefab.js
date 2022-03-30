// Copyright (C) 2022 Scott Henshaw, All Rights Reserved
'use strict';

export default class Prefab {

    constructor( sourceData ) {

        this.__private__ = {
            friction: "1",
            height: "400",
            mass: "1",
            name: "object1",
            restitution: "1",
            shape: "1",
            texture: "object-img-1",
            type: "object",
            value: "1",
            width: "60", 
        }

        this.$view = null;
        
        let my = this.__private__;
        if (sourceData != undefined)
            my = { ...my, ...sourceData }
    }


    get mass() { return this.__private__.mass }
    set mass( newMass ) {
        const my = this.__private__;

        my.mass = newMass
    }


    populate( sourceData ) {
        let my = this.__private__; 

        let data = sourceData;
        if (sourceData.typeof === "string")
            data = JSON.parse( sourceData );

        my = { ...data };
    }


    serialize() {

        return JSON.stringify( this.__private__ );
    }
}