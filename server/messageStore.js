class MessageStore {
  saveMessage(message) { }
  findMessagesForUser(userID) { }
  savePublicMessages(message) { }
  findMessagesPerRoom(room) { }
  findPublicMessages() {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = [];
    this.publicMessages = [];
  }

  saveMessage(message) {
    this.messages.push(message);
  }

  savePublicMessages(message) {
    this.publicMessages.push(message);
  }

  findMessagesPerRoom(room) {
    return this.publicMessages.filter((item)=>{
      return item.room === room
    })
  }
  findPublicMessages() {
    return this.publicMessages
  }

  findMessagesForUser(userID) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

module.exports = {
  InMemoryMessageStore,
};
