import { Moment } from "moment";
import uuid from 'react-native-uuid';

function newId() {
    return uuid.v4().toString()
}

abstract class Entity {
    id?: string;

    protected constructor(id?: string) {
        this.id = id
    }

    getId(): string {
        this.id = this.id || newId();
        return this.id!!
    }
}

export type SignUpCredentials = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Moment;
    sex: string;
}

export type LoginCredentials = {
    email: string;
    password: string;
}

export class User extends Entity {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Moment;
    sex: string;

    constructor(email: string, firstName: string, lastName: string, dateOfBirth: Moment, sex: string, id?: string) {
        super(id);
        this.email = email;
        this.firstName = firstName
        this.lastName = lastName
        this.dateOfBirth = dateOfBirth
        this.sex = sex
    }

    static fromSignUpCredentials(values: SignUpCredentials) {
        return new User(values.email, values.firstName, values.lastName, values.dateOfBirth, values.sex);
    }
}

export class AdRate extends Entity {
    vendor: string;
    type: string;
    user: User;
    score: number;
    timestamp: Moment;

    constructor(user: User, vendor: string, type: string, score: number, timestamp: Moment, id?: string) {
        super(id);
        this.user = user;
        this.vendor = vendor;
        this.type = type;
        this.score = score;
        this.timestamp = timestamp;
    }
}
