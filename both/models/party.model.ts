/**
 * Created by papinaser on 6/30/2017.
 */
import { CollectionObject } from './collection-object.model';
export interface Party extends CollectionObject {
    name: string;
    description: string;
    location: Location;
    owner?: string;
    isPublic: boolean;
    invited?: string[];
    rsvps?: RSVP[];
}
interface RSVP {
    userId: string;
    response: string;
}

interface Location {
    name: string;
    lat?: number;
    lng?: number;
}