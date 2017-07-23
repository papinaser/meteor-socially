/**
 * Created by papinaser on 6/30/2017.
 */
import { Component, OnInit,OnDestroy   } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs/Observable';;
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { CanActivate } from '@angular/router';
import 'rxjs/add/operator/map';
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MouseEvent } from "angular2-google-maps/core";

import { Parties } from '../../../../both/collections/parties.collection';
import { Party } from '../../../../both/models/party.model';
import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';
import template from './party-details.component.html';
import style from './party-details.component.scss'

@Component({
    selector: 'party-details',
    template,
    styles:[style]
})
@InjectUser('user')
export class PartyDetailsComponent implements OnInit,OnDestroy,CanActivate   {
    partyId: string;
    paramsSub: Subscription;
    party: Party;
    partySub: Subscription;
    users: Observable<User>;
    uninvitedSub: Subscription;
    user: Meteor.User;
    // Default center Sanaat share Iran.
    centerLat: number = 35.707232;
    centerLng: number = 51.131830;
    
    constructor(
        private route: ActivatedRoute
    ){}
    ngOnInit() {
        this.paramsSub = this.route.params
            .map(params => params['partyId'])
            .subscribe(partyId =>
            {
                this.partyId = partyId;
                if (this.partySub) {
                    this.partySub.unsubscribe();
                }
                this.partySub = MeteorObservable.subscribe('party', this.partyId).subscribe(() => {
                    MeteorObservable.autorun().subscribe(() => {
                        this.party = Parties.findOne(this.partyId);
                        this.getUsers(this.party);
                    });
                });
                if (this.uninvitedSub) {
                    this.uninvitedSub.unsubscribe();
                }
                this.uninvitedSub = MeteorObservable.subscribe('uninvited', this.partyId).subscribe(() => {
                    this.getUsers(this.party);
                });
            });
    }
    get isOwner(): boolean {
        return this.party && this.user && this.user._id === this.party.owner;
    }
    get isPublic(): boolean {
        return this.party && this.party.isPublic;
    }
    get isInvited(): boolean {
        if (this.party && this.user) {
             const invited = this.party.invited || [];
             return invited.indexOf(this.user._id) !== -1;
        }
        return false;
    }
    get lat(): number {
             return this.party && this.party.location.lat;
    }
    get lng(): number {
         return this.party && this.party.location.lng;
    }
    mapClicked($event: MouseEvent) {
            this.party.location.lat = $event.coords.lat;
            this.party.location.lng = $event.coords.lng;
    }
    
    getUsers(party: Party) {
        if (party) {
            this.users = Users.find({
                id: {
                    $nin: party.invited || [],
                    $ne: Meteor.userId()
                }
            }).zone();
        }
    }
    reply(rsvp: string) {
        MeteorObservable.call('reply', this.party._id, rsvp).subscribe(() => {
            alert('You successfully replied.');
        }, (error) => {
            alert(`Failed to reply due to ${error}`);
        });
    }
    ngOnDestroy() {
        this.paramsSub.unsubscribe();
        this.partySub.unsubscribe();
        this.uninvitedSub.unsubscribe();
    }
    canActivate():boolean  {
            console.log('check can active');
        const party = Parties.findOne(this.partyId);
        return (party && party.owner == Meteor.userId());
    }
    invite(user: Meteor.User) {
        MeteorObservable.call('invite', this.party._id, user._id).subscribe(() => {
            alert('User successfully invited.');
        },(error)=>{
            alert(`Failed to invite due to ${error}`);
        });
    }
    saveParty() {
        if (!Meteor.userId()) {
            alert('Please log in to change this party');
            return;
        }
        if (this.party.owner!=Meteor.userId())
        {
            alert('you can not save others party');
            return;
        }
        Parties.update(this.party._id, {
            $set: {
                name: this.party.name,
                description: this.party.description,
                location: this.party.location,
                isPublic:this.party.isPublic
            }
        });
    }

}

