import bcrypt from 'bcrypt';

class Bcrypt {
  constructor() {
    this.instance = bcrypt;
    this.saltRounds = this.instance.genSalt(10);
  }

  /**
   * @param {any} data
   */
  hashSync(data) {
    return this.instance.hashSync(data, this.saltRounds);
  }

  /**
   * @param {any} toBeEncrypted
   * - This data come from database which has been hashed
   * @param {string} compareData
   * - This data come from body which is sent by user
   */
  compareSync(toBeEncrypted, compareData) {
    return this.instance.compareSync(toBeEncrypted, compareData);
  }
}

export const bcryptService = new Bcrypt();
