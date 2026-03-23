import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type PaymentStatus = {
    #pending;
    #verified;
    #failed;
  };

  module PaymentStatus {
    public func compare(status1 : PaymentStatus, status2 : PaymentStatus) : Order.Order {
      func toNat(status : PaymentStatus) : Nat {
        switch (status) {
          case (#pending) { 0 };
          case (#verified) { 1 };
          case (#failed) { 2 };
        };
      };
      Nat.compare(toNat(status1), toNat(status2));
    };
  };

  type PaymentMethod = {
    #phonePe;
    #googlePay;
    #paytm;
    #bhim;
  };

  module PaymentMethod {
    public func compare(method1 : PaymentMethod, method2 : PaymentMethod) : Order.Order {
      func toNat(method : PaymentMethod) : Nat {
        switch (method) {
          case (#phonePe) { 0 };
          case (#googlePay) { 1 };
          case (#paytm) { 2 };
          case (#bhim) { 3 };
        };
      };
      Nat.compare(toNat(method1), toNat(method2));
    };
  };

  type DepositRequest = {
    user : Principal;
    amount : Nat;
    paymentMethod : PaymentMethod;
    qrCodeData : Text;
    utr : ?Text;
    status : PaymentStatus;
    timestamp : Int;
  };

  module DepositRequest {
    public func compareByAmount(request1 : DepositRequest, request2 : DepositRequest) : Order.Order {
      Nat.compare(request1.amount, request2.amount);
    };

    public func compareByTimestamp(request1 : DepositRequest, request2 : DepositRequest) : Order.Order {
      Int.compare(request1.timestamp, request2.timestamp);
    };
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  let depositRequests = Map.empty<Text, DepositRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Track first registered user
  var firstRegisteredUser : ?Principal = null;

  // Predefined admin credentials
  let ADMIN_EMAIL = "vivekgopgop@gmail.com";
  let ADMIN_EMAIL_2 = "Kumarirani71318@gmail.com";
  let ADMIN_PHONE = "9153873434";

  func generateRequestId() : Text {
    let timestamp = Time.now();
    timestamp.toText();
  };

  func generateQrCodeData(amount : Nat, method : PaymentMethod) : Text {
    let upiId = "95232483@axl";
    let methodText = switch (method) {
      case (#phonePe) { "PhonePe" };
      case (#googlePay) { "Google Pay" };
      case (#paytm) { "Paytm" };
      case (#bhim) { "BHIM" };
    };
    let data = "upi://pay?pa=" # upiId # "&pn=" # methodText # "&am=" # amount.toText() # "&cu=INR";
    data;
  };

  func isAuthorizedAdmin(caller : Principal, profile : ?UserProfile) : Bool {
    // Check if user matches predefined admin credentials
    switch (profile) {
      case (?p) {
        let emailMatch = switch (p.email) {
          case (?email) { email == ADMIN_EMAIL or email == ADMIN_EMAIL_2 };
          case (null) { false };
        };
        let phoneMatch = switch (p.phone) {
          case (?phone) { phone == ADMIN_PHONE };
          case (null) { false };
        };
        if (emailMatch or phoneMatch) {
          return true;
        };
      };
      case (null) {};
    };

    // Check if user is the first registered user
    switch (firstRegisteredUser) {
      case (?firstUser) {
        if (caller == firstUser) {
          return true;
        };
      };
      case (null) {};
    };

    false;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Track first registered user
    if (firstRegisteredUser == null) {
      firstRegisteredUser := ?caller;
    };

    userProfiles.add(caller, profile);

    // Auto-grant admin role if authorized
    if (isAuthorizedAdmin(caller, ?profile)) {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
    };
  };

  public query ({ caller }) func getCallerRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func createDepositRequest(amount : Nat, paymentMethod : PaymentMethod) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create deposit requests");
    };

    let requestId = generateRequestId();
    let qrCodeData = generateQrCodeData(amount, paymentMethod);
    let depositRequest : DepositRequest = {
      user = caller;
      amount;
      paymentMethod;
      qrCodeData;
      utr = null;
      status = #pending;
      timestamp = Time.now();
    };
    depositRequests.add(requestId, depositRequest);
    requestId;
  };

  public query ({ caller }) func getDepositRequest(requestId : Text) : async DepositRequest {
    switch (depositRequests.get(requestId)) {
      case (null) { Runtime.trap("Deposit request not found") };
      case (?request) {
        // Only the owner or admin can view a deposit request
        if (request.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own deposit requests");
        };
        request;
      };
    };
  };

  public shared ({ caller }) func submitUtr(requestId : Text, utr : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit UTR");
    };

    switch (depositRequests.get(requestId)) {
      case (null) { Runtime.trap("Deposit request not found") };
      case (?request) {
        // Only the owner can submit UTR for their own deposit request
        if (request.user != caller) {
          Runtime.trap("Unauthorized: Can only submit UTR for your own deposit requests");
        };

        let updatedRequest : DepositRequest = {
          user = request.user;
          amount = request.amount;
          paymentMethod = request.paymentMethod;
          qrCodeData = request.qrCodeData;
          utr = ?utr;
          status = request.status;
          timestamp = request.timestamp;
        };
        depositRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func verifyPayment(requestId : Text, status : PaymentStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can verify payments");
    };

    switch (depositRequests.get(requestId)) {
      case (null) { Runtime.trap("Deposit request not found") };
      case (?request) {
        let updatedRequest : DepositRequest = {
          user = request.user;
          amount = request.amount;
          paymentMethod = request.paymentMethod;
          qrCodeData = request.qrCodeData;
          utr = request.utr;
          status;
          timestamp = request.timestamp;
        };
        depositRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getAllDepositRequests() : async [DepositRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all deposit requests");
    };

    depositRequests.values().toArray();
  };

  public query ({ caller }) func getCallerDepositRequests() : async [DepositRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view deposit requests");
    };

    let callerRequests = depositRequests.values().toArray().filter(
      func(request) { request.user == caller }
    );
    callerRequests;
  };
};
