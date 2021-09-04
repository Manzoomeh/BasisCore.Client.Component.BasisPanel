import { IQuestionItem } from "./type-alias";

export class QuestionUtil {
  public static toObject(list: Array<IQuestionItem>, obj?: any): any {
    const retVal = obj ?? {};
    list.forEach((question) =>
      Reflect.set(retVal, QuestionUtil.s.get(question.prpid), question.answer)
    );
    return retVal;
  }

  static s: Map<number, string> = new Map([
    [1, "fName"],
    [2, "lName"],
    [3, "email"],
    [4, "telephone"],
    [5, "mobile"],
    [6, "address"],
    [7, "sex"],
    [8, "dob"],
    [9, "postalCode"],
    [10, "fax"],
    [94, "thumbnail"],
    [95, "language"],
    [96, "currency"],
  ]);
}
