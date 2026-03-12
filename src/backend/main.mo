import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type QuestionType = {
    #text;
    #multipleChoice : [Text];
    #rating_1_5;
  };

  public type Question = {
    id : Nat;
    questionLabel : Text;
    questionType : QuestionType;
  };

  public type SurveyForm = {
    id : Nat;
    title : Text;
    questions : [Question];
    creator : Principal;
  };

  public type Response = {
    formId : Nat;
    answers : [(Nat, Text)];
    respondent : ?Principal;
  };

  var nextFormId = 0;
  let surveyForms = Map.empty<Nat, SurveyForm>();
  let responses = Map.empty<Nat, [Response]>();

  public shared ({ caller }) func createForm(title : Text, questions : [Question]) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create forms");
    };

    let formId = nextFormId;
    let updatedQuestions = questions.map(
      func(q) {
        { q with id = nextFormId };
      }
    );

    let form : SurveyForm = {
      id = formId;
      title;
      questions = updatedQuestions;
      creator = caller;
    };

    surveyForms.add(formId, form);
    responses.add(formId, []);
    nextFormId += 1;
    formId;
  };

  public query ({ caller }) func getForm(formId : Nat) : async ?SurveyForm {
    surveyForms.get(formId);
  };

  public query ({ caller }) func listForms() : async [SurveyForm] {
    surveyForms.values().toArray();
  };

  public shared ({ caller }) func submitResponse(formId : Nat, answers : [(Nat, Text)], _shareToken : Text) : async () {
    let form = switch (surveyForms.get(formId)) {
      case (null) { Runtime.trap("Form does not exist") };
      case (?form) { form };
    };

    // Validate answers if needed (e.g., check types)

    let response : Response = {
      formId;
      answers;
      respondent = if (caller.isAnonymous()) { null } else { ?caller };
    };

    let existingResponses = switch (responses.get(formId)) {
      case (null) { Runtime.trap("Response list does not exist for form") };
      case (?resps) { resps };
    };

    responses.add(formId, existingResponses.concat([response]));
  };

  public query ({ caller }) func getFormResponses(formId : Nat) : async [Response] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view responses");
    };
    switch (responses.get(formId)) {
      case (null) { [] };
      case (?resps) { resps };
    };
  };
};
