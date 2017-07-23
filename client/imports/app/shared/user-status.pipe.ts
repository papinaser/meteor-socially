/**
 * Created by papinaser on 7/9/2017.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { User } from '../../../../both/models/user.model';
@Pipe({
  name:'userStatus'
})
export class UserStatusPipe implements  PipeTransform{
    transform(user:User):string{
        if (!user) {
            return '';
        }

    }
}