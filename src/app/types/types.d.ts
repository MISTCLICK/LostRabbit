type Level = {
  layout: string[][];
  start: number[];
  finish: number[];
  divisions: number;
};

type NewLevel = {
  layout: number[][][];
  start: number[];
  finish: number[];
  divisions: number;
};

type InitData =
  | {
      success: true;
      groupName: string;
      groupNum: number;
      userId: string;
    }
  | {
      success: false;
      groupName: null;
      groupNum: null;
      userId: null;
    };

type PageData = {
  success: true;
  groupName: string;
  groupNum: number;
  userId: string;
  token: string;
};

interface JWTPayload {
  iat?: number | undefined;
  iss?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
}
interface AdditionalPayload {
  userId: string;
}
type JWTData = {
  payload: JWTPayload & AdditionalPayload;
  protectedHeader: { alg: string; typ: string };
};

type NewTokenObject = {
  token: string;
  userId: string;
  groupNum: number;
  groupName: string;
};

interface HTMLAnswerValue {
  value: string;
}

interface HTMLCheckboxesValues {
  value: string;
  checked: boolean;
}

interface Answer {
  question: string;
  answer: string | string[];
}

type SurveyAnswers = Answer[];

type SurveyQuestion = {
  question: string;
  options: string[];
  type: string;
  name: string;
};
