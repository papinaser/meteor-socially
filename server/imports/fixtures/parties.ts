import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/models/party.model';
export function loadParties() {
    if (Parties.find().cursor.count() === 0) {
        const parties: Party[] = [{
            name: 'Dubstep-Free Zone',
            description: 'Can we please just for an evening not listen to dubstep.',
            location: {name:'Palo Alto'},
            isPublic: true
        },
            {
                name: 'All dubstep all the time',
                description: 'Get it on!',
                location: {name: 'San Francisco'},
                isPublic: true
            }];
        parties.forEach((party: Party) => Parties.insert(party));

        for (var i = 0; i < 28; i++) {
            Parties.insert({
                name: Fake.sentence(50),
                location: {name: Fake.sentence(10)},
                description: Fake.sentence(100),
                isPublic: true
            })
        }
    }

}
