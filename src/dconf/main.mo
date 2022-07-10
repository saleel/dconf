import Text "mo:base/Text";
import Map "mo:base/RBTree";

actor {
  let map = Map.RBTree<Text, Text>(Text.compare);

  public func set(key: Text, value: Text) : async () {
    map.put(key, value);
  };

  public func get(key : Text) : async ?Text {
    let value = map.get(key);

    return value;
  };
};
