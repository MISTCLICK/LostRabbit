type Level = {
  layout: string[][];
  start: number[];
  finish: number[];
  divisions: number;
};

type InitData =
  | {
      success: true;
      groupName: "PIRMAJĀ" | "OTRAJĀ";
      groupNum: number;
      userId: string;
    }
  | {
      success: false;
      groupName: null;
      groupNum: null;
      userId: null;
    };

type JWTData = JWTVerifyResult & { payload: { userId: string } };
