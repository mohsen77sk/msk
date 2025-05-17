export class User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  username?: string;
  avatar?: string;

  constructor(input: User) {
    this.id = input.id;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.phoneNumber = input.phoneNumber;
    this.username = input.username;
    this.avatar = input.avatar;
  }

  get name(): string {
    return this.firstName + ' ' + this.lastName;
  }
}
