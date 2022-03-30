// Copyright (C) 2022 Scott Henshaw, All Rights Reserved
'use strict';

export default class GameObject {

    constructor( prefab ) {

        this.prefab = prefab

        const my = this.__private__;
        if (sourceData != undefined)
            my = { ...my, ...sourceData }
    }


    get mass() { return this.__private__.mass }
    set mass( newMass ) {
        const my = this.__private__;

        my.mass = newMass
    }


    populate( sourceData ) {
        const my = this.__private__;

        let data = sourceData;
        if (sourceData.typeof === "string")
            data = JSON.parse( sourceData );

        my = { ...data };
    }


    serialize() {

        return JSON.stringify( this.__private__ );
    }
}