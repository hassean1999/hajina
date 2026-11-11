class User {
  final String id, name;
  final int level;
  const User(this.id, this.name, this.level);
}

class Room {
  final String id, title;
  final User host;
  final int viewers;
  const Room(this.id, this.title, this.host, this.viewers);
}

class Gift {
  final String name;
  final int price;
  const Gift(this.name, this.price);
}

class Message {
  final String from, text;
  final bool mine;
  const Message(this.from, this.text, {this.mine = false});
}
