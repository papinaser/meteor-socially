/**
 * Created by papinaser on 6/30/2017.
 */
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { Meteor } from 'meteor/meteor';

import { Parties } from '../../../../both/collections/parties.collection';
import template from './parties-form.component.html';

@Component({
    selector: 'parties-form',
    template
})

@InjectUser('user')
export class PartiesFormComponent implements OnInit {
    addForm: FormGroup;
    user: Meteor.User;

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
                    name: this.addForm.value.location
                },
                isPublic: this.addForm.value.isPublic,
                owner: Meteor.userId()
            });
            this.addForm.reset();
        }
    }
}
