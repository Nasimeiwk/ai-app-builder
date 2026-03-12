import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";

actor {
  type Session = {
    id : Nat;
    title : Text;
    createdAt : Time.Time;
  };

  module Session {
    public func compare(session1 : Session, session2 : Session) : Order.Order {
      Nat.compare(session1.id, session2.id);
    };
  };

  type Message = {
    id : Nat;
    sessionId : Nat;
    role : Text;
    content : Text;
    timestamp : Time.Time;
  };

  var nextSessionId = 0;
  var nextMessageId = 0;

  let sessions = List.empty<Session>();
  let messagesArray = List.empty<Message>();

  public shared ({ caller }) func createSession(title : Text) : async Session {
    let sessionId = nextSessionId;
    nextSessionId += 1;

    let session : Session = {
      id = sessionId;
      title;
      createdAt = Time.now();
    };

    sessions.add(session);
    session;
  };

  public query ({ caller }) func listSessions() : async [Session] {
    sessions.toArray().sort();
  };

  public shared ({ caller }) func addMessage(sessionId : Nat, role : Text, content : Text) : async Message {
    if (role != "user" and role != "assistant") {
      Runtime.trap("Invalid role. Must be 'user' or 'assistant'");
    };

    let _ = switch (sessions.find(func(s) { s.id == sessionId })) {
      case (null) { Runtime.trap("Session not found") };
      case (?_) {};
    };

    let messageId = nextMessageId;
    nextMessageId += 1;

    let message : Message = {
      id = messageId;
      sessionId;
      role;
      content;
      timestamp = Time.now();
    };

    messagesArray.add(message);
    message;
  };

  public query ({ caller }) func getMessagesBySession(sessionId : Nat) : async [Message] {
    messagesArray.toArray().filter(func(m) { m.sessionId == sessionId });
  };

  public shared ({ caller }) func deleteSession(sessionId : Nat) : async () {
    // Remove the session from sessions list
    let filteredSessions = sessions.toArray().filter(func(s) { s.id != sessionId });
    sessions.clear();
    sessions.addAll(filteredSessions.values());

    // Remove messages associated with the session
    let filteredMessages = messagesArray.toArray().filter(func(m) { m.sessionId != sessionId });
    messagesArray.clear();
    messagesArray.addAll(filteredMessages.values());
  };
};
