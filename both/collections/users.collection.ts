/**
 * Created by papinaser on 7/9/2017.
 */
import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
export const Users = MongoObservable.fromExisting(Meteor.users);

