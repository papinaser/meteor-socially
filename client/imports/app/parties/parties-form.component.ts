/**
 * Created by papinaser on 6/30/2017.
 */
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';

import { Parties } from '../../../../both/collections/parties.collection';
import template from './parties-form.component.html';
import style from './parties-form.component.scss';

@Component({
    selector: 'parties-form',
    template,
    styles:[style]
})

@InjectUser('user')
export class PartiesFormComponent implements OnInit {
    addForm: FormGroup;
    newPartyPosition: {lat:number, lng: number} = {lat: 35.709397, lng: 51.128393};

    constructor(
        private formBuilder: FormBuilder
    ){}
    ngOnInit() {
        this.addForm = this.formBuilder.group({
            name: ['',Validators.required],
            description: [],
            location: ['',Validators.required   ],
            isPublic: [false]
        });
    }
    mapClicked($event) {
        this.newPartyPosition = $event.coords;
    }
    addParty(): void {
        if (this.addForm.valid) {
            if (!Meteor.userId()) {
                alert('Please log in to add a party');
                return;
            }
            Parties.insert({
                name: this.addForm.value.name,
                description: this.addForm.value.description,
                location: {
                    name: this.addForm.value.location,
                    lat: this.newPartyPosition.lat,
                    lng: this.newPartyPosition.lng
                },
                isPublic: this.addForm.value.isPublic,
                owner: Meteor.userId()
            });
            this.addForm.reset();
        }
    }
}
